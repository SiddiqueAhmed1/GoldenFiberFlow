import xlsx from "xlsx";
import stringSimilarity from "string-similarity";
import SupplierModel from "../Models/SupplierModel.js";

// Helper function to remove all spaces, commas, dots and convert Ltd/Limited to lowercase in names
const normalizeSupplierName = (name) => {
  if (!name) return "";
  let cleanName = name.toString().toLowerCase();

  // ltd. and limited count as same
  cleanName = cleanName.replace(/\blimited\b/g, "ltd");
  cleanName = cleanName.replace(/\bltd\b/g, "ltd");

  // except a-z remove all 0, space
  return cleanName.replace(/[^a-z0-9]/g, "").trim();
};

// get all suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await SupplierModel.find().populate(
      "createdBy",
      "name email",
    );

    return res.status(200).json({
      message: "Suppliers fetched successfully",
      success: true,
      error: false,
      data: suppliers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// create supplier
export const createSupplier = async (req, res) => {
  const { name, contactPerson, mobile, email, address, paymentTerms, status } =
    req.body;
  const userId = req.user.id;

  try {
    if (!name || !contactPerson || !mobile || !email || !address) {
      return res.status(400).json({
        message: "All required fields must be filled",
        success: false,
        error: true,
      });
    }

    // ইমেইল ডুপ্লিকেট চেক
    const existingSupplier = await SupplierModel.findOne({
      email: email.toLowerCase().trim(),
    });
    if (existingSupplier) {
      return res.status(400).json({
        message: "A supplier with this email already exists",
        success: false,
        error: true,
      });
    }

    const supplier = new SupplierModel({
      name,
      contactPerson,
      mobile,
      email: email.toLowerCase().trim(),
      address,
      paymentTerms,
      status,
      createdBy: userId,
    });

    await supplier.save();
    await supplier.populate("createdBy", "name email");

    return res.status(201).json({
      message: "Supplier created successfully",
      success: true,
      error: false,
      data: supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// ৩. excel file upload & bulk import
export const uploadSuppliersExcel = async (req, res) => {
  const userId = req.user.id;

  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Please upload an excel file",
        success: false,
        error: true,
      });
    }

    // data read from excel buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0]; // take 1st sheet
    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet);

    if (rawData.length === 0) {
      return res.status(400).json({
        message: "The excel file is empty",
        success: false,
        error: true,
      });
    }

    // take all suppliers name from database
    const dbSuppliers = await SupplierModel.find({}, "name email");
    const existingEmails = new Set(
      dbSuppliers.map((s) => s.email.toLowerCase()),
    );

    const suppliersToSave = [];
    const skippedDuplicates = [];

    //check every row
    for (const row of rawData) {
      const name = row["Company Name"] || row["name"];
      const contactPerson = row["Contact Person"] || row["contactPerson"];
      const mobile = row["Mobile"] || row["mobile"];
      const email =
        row["Email"]?.toString().toLowerCase().trim() ||
        row["email"]?.toString().toLowerCase().trim();
      const address = row["Address"] || row["address"];
      const paymentTerms =
        row["Payment Terms"] || row["paymentTerms"] || "Cash";
      const status = row["Status"] || row["status"] || "Active";

      // validate necessary fields
      if (!name || !contactPerson || !mobile || !email || !address) {
        continue;
      }

      // email duplicate check
      if (existingEmails.has(email)) {
        skippedDuplicates.push({ name, reason: "Email already exists" });
        continue;
      }

      //check company duplicate name
      const normalizedCurrentName = normalizeSupplierName(name);
      let isDuplicateName = false;

      for (const dbSup of dbSuppliers) {
        const normalizedDbName = normalizeSupplierName(dbSup.name);

        if (normalizedCurrentName === normalizedDbName) {
          isDuplicateName = true;
          break;
        }

        const similarity = stringSimilarity.compareTwoStrings(
          normalizedCurrentName,
          normalizedDbName,
        );
        if (similarity > 0.85) {
          isDuplicateName = true;
          break;
        }
      }

      if (isDuplicateName) {
        skippedDuplicates.push({
          name,
          reason: "Similar company name already exists",
        });
        continue;
      }

      // add into insert list
      suppliersToSave.push({
        name,
        contactPerson,
        mobile: Number(mobile),
        email,
        address,
        paymentTerms,
        status,
        createdBy: userId,
      });

      existingEmails.add(email);
    }

    // save into database all together
    let savedData = [];
    if (suppliersToSave.length > 0) {
      savedData = await SupplierModel.insertMany(suppliersToSave);
      savedData = await SupplierModel.populate(savedData, {
        path: "createdBy",
        select: "name email",
      });
    }

    return res.status(201).json({
      message: `${suppliersToSave.length} suppliers imported successfully.`,
      success: true,
      error: false,
      insertedCount: suppliersToSave.length,
      skippedCount: skippedDuplicates.length,
      data: savedData,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || error, success: false, error: true });
  }
};

// udpate supplier
export const updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await SupplierModel.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("createdBy", "name email");

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Supplier updated successfully",
      success: true,
      error: false,
      data: supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// delete supplier
export const deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSupplier = await SupplierModel.findByIdAndDelete(id);

    if (!deletedSupplier) {
      return res.status(404).json({
        message: "Supplier not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Supplier deleted successfully",
      success: true,
      error: false,
      data: deletedSupplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

// get single supplier
export const getSingleSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await SupplierModel.findById(id).populate(
      "createdBy",
      "name email",
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
        success: false,
        error: true,
      });
    }

    return res.status(200).json({
      message: "Supplier fetched successfully",
      success: true,
      error: false,
      data: supplier,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      success: false,
      error: true,
    });
  }
};

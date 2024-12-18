const Address = require("../models/Address");

// POST ADDRESS
exports.createAddress = (req, res) => {
  const address = Address.create(req.body);
  if (!address) {
    return res
      .status(400)
      .json({ success: false, error: "address not created" });
  } else {
    return res
      .status(200)
      .json({ success: true, message: "Address Created Successfully" });
  }
};

exports.getaddressbyId = async (req, res, id, next) => {
  const address = await Address.findOne({ _id: id });
  console.log(address);
  if (!address) {
    return res.status(400).json({ message: "unable to find user address" });
  } else {
    req.Address = address;
    next();
  }
};

exports.getAddress = async (req, res) => {
  const address = await Address.find({ user: req.profile._id });
  if (!address) {
    return res.status(400).json({ success: false, error: "No Address Found" });
  } else {
    return res.json({ success: true, data: address });
  }
};

exports.getAllAddress = async (req, res) => {
  const address = await Address.find();
  if (!address) {
    return res.status(400).json({ success: false, error: "No Address Found" });
  } else {
    return res.json({ success: true, Addresses: address });
  }
};

exports.updateAddress = async (req, res) => {
  const address = await Address.updateOne(
    { _id: req.params.addressId },
    { $set: req.body }
  );

  if (!address) {
    return res
      .status(400)
      .json({ success: false, error: "address not updated" });
  } else {
    return res.json({ success: true, address: address });
  }
};

exports.getAllAddressOfUserByUserId = (req, res, next) => {
  try {
    Address.find({ user: req.profile._id }).then((addresses, error) => {
      if (addresses) {
        req.AllAddressOfUser = addresses;
        next();
      }
      if (error) {
        return res
          .status(400)
          .json({ success: false, error: "No Address Found" });
      }
    });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .json({ success: false, error: "Something went wrong" });
  }
};

exports.setOtherAddressAsNotDefault = async (req, res, next) => {
  const allAddress = req.AllAddressOfUser;
  let myOperations = allAddress.map((item) => {
    return {
      updateOne: {
        filter: { _id: item._id },
        update: {
          $set: {
            defaultAddress: 0,
          },
        },
      },
    };
  });

  const address = await Address.bulkWrite(myOperations, {});
  if (!address) {
    return res
      .status(400)
      .json({ success: false, error: "Bulk Operation Failed" });
  } else {
    next();
  }
};

exports.setdefaultAddress = async (req, res) => {
  const address = await Address.updateOne(
    { _id: req.params.singleAddressId },
    { $set: { defaultAddress: 1 } }
  );
  if (!address) {
    return res
      .status(400)
      .json({ success: false, error: "Default Address Not Set" });
  } else {
    return res.json({ success: true, address: address });
  }
};

exports.deleteAddress = async (req, res) => {
  if ("") {
    return res.status(402).json({
      errors: "no address found",
    });
  }

  const deletedAddress = await Address.findByIdAndDelete(req.params.addressId);
  if (!deletedAddress) {
    return res
      .status(400)
      .json({ message: "user or address is not eligible to delete" });
  } else {
    return res.json(`${deletedAddress._id} is deleted`);
  }
};

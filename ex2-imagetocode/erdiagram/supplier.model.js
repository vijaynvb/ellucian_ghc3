class Supplier {
  constructor({
    supplierId = null,
    supplierName = "",
    contactName = "",
    address = "",
    city = "",
    postalCode = "",
    country = "",
    phone = "",
  } = {}) {
    this.supplierId = supplierId;
    this.supplierName = supplierName;
    this.contactName = contactName;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.country = country;
    this.phone = phone;
  }

  static tableName = "Suppliers";

  static primaryKey = "supplierId";
}

module.exports = Supplier;

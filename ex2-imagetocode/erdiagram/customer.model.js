class Customer {
  constructor({
    customerId = null,
    companyName = "",
    contactName = "",
    contactTitle = "",
    address = "",
    city = "",
    postalCode = "",
    country = "",
    phone = "",
  } = {}) {
    this.customerId = customerId;
    this.companyName = companyName;
    this.contactName = contactName;
    this.contactTitle = contactTitle;
    this.address = address;
    this.city = city;
    this.postalCode = postalCode;
    this.country = country;
    this.phone = phone;
  }

  static tableName = "Customers";

  static primaryKey = "customerId";
}

module.exports = Customer;

class Order {
  constructor({
    orderId = null,
    customerId = null,
    employeeId = null,
    orderDate = null,
    requiredDate = null,
    shippedDate = null,
    shipVia = null,
    freight = 0,
    shipName = "",
    shipAddress = "",
    shipCity = "",
    shipPostalCode = "",
    shipCountry = "",
  } = {}) {
    this.orderId = orderId;
    this.customerId = customerId;
    this.employeeId = employeeId;
    this.orderDate = orderDate;
    this.requiredDate = requiredDate;
    this.shippedDate = shippedDate;
    this.shipVia = shipVia;
    this.freight = freight;
    this.shipName = shipName;
    this.shipAddress = shipAddress;
    this.shipCity = shipCity;
    this.shipPostalCode = shipPostalCode;
    this.shipCountry = shipCountry;
  }

  static tableName = "Orders";

  static primaryKey = "orderId";

  static foreignKeys = {
    customerId: "Customers.customerId",
  };
}

module.exports = Order;

class OrderDetails {
  constructor({
    orderDetailsId = null,
    orderId = null,
    productId = null,
    unitPrice = 0,
    quantity = 0,
    discount = 0,
  } = {}) {
    this.orderDetailsId = orderDetailsId;
    this.orderId = orderId;
    this.productId = productId;
    this.unitPrice = unitPrice;
    this.quantity = quantity;
    this.discount = discount;
  }

  static tableName = "OrderDetails";

  static primaryKey = "orderDetailsId";

  static foreignKeys = {
    orderId: "Orders.orderId",
    productId: "Products.productId",
  };
}

module.exports = OrderDetails;

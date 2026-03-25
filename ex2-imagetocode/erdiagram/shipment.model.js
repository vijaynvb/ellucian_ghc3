class Shipment {
  constructor({
    shipmentId = null,
    orderId = null,
    shipperId = null,
    shipmentDate = null,
  } = {}) {
    this.shipmentId = shipmentId;
    this.orderId = orderId;
    this.shipperId = shipperId;
    this.shipmentDate = shipmentDate;
  }

  static tableName = "Shipments";

  static primaryKey = "shipmentId";

  static foreignKeys = {
    orderId: "Orders.orderId",
  };
}

module.exports = Shipment;

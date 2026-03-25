class Product {
  constructor({
    productId = null,
    productName = "",
    supplierId = null,
    categoryId = null,
    quantityPerUnit = "",
    unitPrice = 0,
    unitsInStock = 0,
    unitsOnOrder = 0,
    reorderLevel = 0,
  } = {}) {
    this.productId = productId;
    this.productName = productName;
    this.supplierId = supplierId;
    this.categoryId = categoryId;
    this.quantityPerUnit = quantityPerUnit;
    this.unitPrice = unitPrice;
    this.unitsInStock = unitsInStock;
    this.unitsOnOrder = unitsOnOrder;
    this.reorderLevel = reorderLevel;
  }

  static tableName = "Products";

  static primaryKey = "productId";
}

module.exports = Product;

import Product from "../models/Product.model.js";

export const validateStock = async (items) => {
  const errors = [];
  await Promise.all(
    items.map(async ({ product, quantity, name }) => {
      const p = await Product.findById(product).select("stock isActive name");
      if (!p?.isActive) errors.push(`"${name}" is unavailable`);
      else if (p.stock < quantity) errors.push(`"${p.name}": only ${p.stock} in stock`);
    })
  );
  return errors;
};

export const deductStock = (items) =>
  Promise.all(
    items.map(({ product, quantity }) =>
      Product.findByIdAndUpdate(product, {
        $inc: { stock: -quantity, sales: quantity },
      }).then(async (p) => {
        if (p && p.stock - quantity <= 0)
          await Product.findByIdAndUpdate(product, { stock: 0, status: "sold_out" });
      })
    )
  );

export const restoreStock = (items) =>
  Promise.all(
    items.map(({ product, quantity }) =>
      Product.findByIdAndUpdate(product, {
        $inc: { stock: quantity, sales: -quantity },
      }, { new: true }).then(async (p) => {
        if (p?.status === "sold_out" && p.stock > 0)
          await Product.findByIdAndUpdate(product, { status: "active" });
      })
    )
  );
const ShoppingListService = {
  getAllItems(knex) {
    return knex.select("*").from("shopping_list");
  },
  getById(knex, id) {
    return knex.from("shopping_list").select("*").where("id", id).first();
  },
  deleteItem(knex, id) {
    return knex("shopping_list").where({ id }).delete();
  },
  updateItem(knex, id, nF) {
    return knex("shopping_list").where({ id }).update(nF);
  },
  insertItem(knex, nI) {
    return knex
      .insert(nI)
      .into("shopping_list")
      .returning("*")
      .then((rows) => rows[0]);
  },
};

module.exports = ShoppingListService;

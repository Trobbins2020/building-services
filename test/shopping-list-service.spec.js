const ShoppingListService = require("../src/shopping-list-service");
const knex = require("knex");

describe(`Shopping List Service`, function () {
  let db;
  let testItems = [
    {
      id: 1,
      name: "First test item!",
      date_added: new Date("2029-01-22T16:28:32.615Z"),
      price: "12.00",
      category: "Main",
    },
    {
      id: 2,
      name: "Second test item!",
      date_added: new Date("2100-05-22T16:28:32.615Z"),
      price: "21.00",
      category: "Snack",
    },
    {
      id: 3,
      name: "Third test item!",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      price: "3.00",
      category: "Lunch",
    },
    {
      id: 4,
      name: "Third test item!",
      date_added: new Date("1919-12-22T16:28:32.615Z"),
      price: "0.99",
      category: "Breakfast",
    },
  ];

  before(() => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db("shopping_list").truncate());

  afterEach(() => db("shopping_list").truncate());

  after(() => db.destroy());

  context(`Given 'shopping_list' has Some data`, () => {
    beforeEach(() => {
      return db.into("shopping_list").insert(testItems);
    });

    it(`getAllItems() all items from 'shopping_list' table`, () => {
      const expectedItems = testItems.map((item) => ({
        ...item,
        checked: false,
      }));
      return ShoppingListService.getAllItems(db).then((actual) => {
        expect(actual).to.eql(expectedItems);
      });
    });

    it(`getById() an item by id from 'shopping_list' table`, () => {
      const idToGet = 2;
      const thirdItem = testItems[idToGet - 1];
      return ShoppingListService.getById(db, idToGet).then((actual) => {
        expect(actual).to.eql({
          id: idToGet,
          name: thirdItem.name,
          date_added: thirdItem.date_added,
          price: thirdItem.price,
          category: thirdItem.category,
          checked: false,
        });
      });
    });

    it(`deleteItem() removes an item by id from 'shopping_list' table`, () => {
      const idToDelete = 2;
      return ShoppingListService.deleteItem(db, idToDelete)
        .then(() => ShoppingListService.getAllItems(db))
        .then((AllI) => {
          const expected = testItems
            .filter((item) => item.id !== idToDelete)
            .map((item) => ({
              ...item,
              checked: false,
            }));
          expect(AllI).to.eql(expected);
        });
    });

    it(`updateItem() updates an item in the 'shopping_list' table`, () => {
      const IDofUpdate = 2;
      const newItemData = {
        name: "New Updated Title",
        price: "6.9",
        date_added: new Date(),
        checked: true,
      };
      const originalItem = testItems[IDofUpdate - 1];
      return ShoppingListService.updateItem(db, IDofUpdate, newItemData)
        .then(() => ShoppingListService.getById(db, IDofUpdate))
        .then((item) => {
          expect(item).to.eql({
            id: IDofUpdate,
            ...originalItem,
            ...newItemData,
          });
        });
    });
  });

  context(`Given 'shopping_list' has no data`, () => {
    it(`getAllItems() resolves an empty array`, () => {
      return ShoppingListService.getAllItems(db).then((actual) => {
        expect(actual).to.eql([]);
      });
    });

    it(`insertItem() inserts an item and resolves it with an 'id'`, () => {
      const newItem = {
        name: "Testing New Name",
        price: "5.55",
        date_added: new Date("2020-01-01T00:00:00.000Z"),
        checked: true,
        category: "Dinner",
      };
      return ShoppingListService.insertItem(db, newItem).then((actual) => {
        expect(actual).to.eql({
          id: 1,
          name: newItem.name,
          price: newItem.price,
          date_added: newItem.date_added,
          checked: newItem.checked,
          category: newItem.category,
        });
      });
    });
  });
});

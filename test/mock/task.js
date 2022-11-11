const { faker } = require('@faker-js/faker');

const taskMock = () => ({
  title: faker.lorem.sentence(),
  isDone: false,
});

module.exports = {
  taskMock,
};

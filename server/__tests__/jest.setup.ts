import {
  setupTestDatabase,
  teardownTestDatabase,
  clearTestDatabase,
} from "./setup/database.setup.js";

beforeAll(async () => {
  await setupTestDatabase();
});

afterAll(async () => {
  await teardownTestDatabase();
});

beforeEach(async () => {
  await clearTestDatabase();
});

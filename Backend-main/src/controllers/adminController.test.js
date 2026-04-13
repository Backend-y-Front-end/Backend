const { config } = require('dotenv');
config();

test('hello world!', () => {
	expect(1 + 1).toBe(2);
});
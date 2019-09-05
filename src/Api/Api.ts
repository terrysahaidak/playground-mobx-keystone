import { groupsMock } from './mocks';

const delay = (time: number) =>
  new Promise((res) => setTimeout(res, time));

export const Groups = {
  async getAll() {
    await delay(400);

    return groupsMock;
  },
};

import Admin
from "./auth.model.js";

export const findByUsername =
(username) => {
  return Admin.findOne({
    username
  });
};

export const create =
(payload) => {
  return Admin.create(
    payload
  );
};
import { WishList } from "../entity";

export interface IExpandWish extends WishList {
  is_favorite: boolean;
  is_owner: boolean;
}

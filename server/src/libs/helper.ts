import { IExpandWish } from "../types";

interface ITransObj {
  obj: { [key: string | number]: unknown };
}

const transfObject = (obj: ITransObj, prefix: string) => {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      if (key.startsWith(prefix)) {
        return [key.split(prefix)[1], value];
      }
      return [key, value];
    })
  );
};

export const transfDaTa = (arr: ITransObj[], prefix: string) =>
  arr.map((el: any) => transfObject(el, prefix));

export const convertWishItems = (wishList: IExpandWish[]) => {
  return wishList.map((wish: IExpandWish) => {
    return {
      title: wish.title,
      description: wish.description,
      id: wish.id,
      photo: wish.photo,
      isFavorite: wish.is_favorite,
      currentAmount: wish.current_amount,
      totalAmount: wish.total_amount,
      isOwner: wish.is_owner,
    };
  });
};

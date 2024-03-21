import cls from "./PageError.module.scss";

export const PageError = () => {
  const reloadPage = () => {
    window.location.reload();
  };
  return (
    <div className={cls.PageError}>
      <p>Произошла непредвиденная ошибка</p>
      <button type="button" onClick={reloadPage}>
        Обновить страницу
      </button>
    </div>
  );
};

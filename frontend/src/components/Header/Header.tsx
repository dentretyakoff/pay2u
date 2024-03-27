import { memo } from "react";
import { Link } from "react-router-dom";
import Arrow from "shared/assets/icons/arrow-back.svg";
import cls from "./Header.module.scss";

interface HeaderProps {
  path: string;
  title?: string;
}

export const Header = memo(({ path, title = "" }: HeaderProps) => {
  return (
    <header className={cls.Header}>
      <Link to={path} className={cls.link}><img src={Arrow} alt="go back arrow" /></Link>
      <h1 className={cls.title}>{title}</h1>
    </header>
  );
});

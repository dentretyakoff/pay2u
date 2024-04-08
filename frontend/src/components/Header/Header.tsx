import { memo } from "react";
import { Link } from "react-router-dom";
import Arrow from "shared/assets/icons/arrow-back.svg";
import cls from "./Header.module.scss";

interface HeaderProps {
  path?: string;
  title?: string;
  modal?: boolean;
  onCLick?: () => void;
}

export const Header = memo(
  ({ path = "/", title = "", modal, onCLick }: HeaderProps) => {
    const image = <img src={Arrow} alt="go back arrow" />;
    return (
      <header className={cls.Header}>
        {!modal ? (
          <Link to={path} className={cls.link}>
            {image}
          </Link>
        ) : (
          <button type="button" className={cls.link} onClick={onCLick}>
            {image}
          </button>
        )}
        <h1 className={cls.title}>{title}</h1>
      </header>
    );
  }
);

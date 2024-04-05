import { Suspense, memo } from "react";
import { Loader } from "widgets/Loader/Loader";
import { Header } from "components/Header/Header";
import cls from "./MySubscriptionsPage.module.scss";

const MySubscriptionsPage = memo(() => {
  return (
    <Suspense fallback={<Loader />}>
      <main className={cls.MySubscriptionsPage}>
        <Header path="/" title="Мои подключенные сервисы" />
        <section className={cls.expenses}>
            <div className={cls.allTime}>
                <p></p>
                <p>Выгода за все время</p>
            </div>
            <div className={cls.byMonth}></div>
        </section>
      </main>
    </Suspense>
  );
});

export default MySubscriptionsPage;

import { Suspense, memo } from "react";
import { useGetExpensesQuery } from "services/PaymentsService";
import { Loader } from "widgets/Loader/Loader";
import { Header } from "components/Header/Header";
import { SubscriptionsTabs } from "components/SubscriptionsTabs/SubscriptionsTabs";
import coinsicon from "shared/assets/icons/coins-icon.svg";
import { months } from "shared/data/constants";
import cls from "./MySubscriptionsPage.module.scss";

const MySubscriptionsPage = memo(() => {
  const { data: expenses } = useGetExpensesQuery();

  const currentMonthNum = new Date().getMonth();
  const currentMonth = months[currentMonthNum];

  return (
    <Suspense fallback={<Loader />}>
      <main className={cls.MySubscriptionsPage}>
        <Header path="/" title="Мои подключенные сервисы" />
        <section className={cls.expenses}>
          <div className={cls.allTime}>
            <span>{expenses?.total_cashback} ₽</span>
            <p>Выгода за все время</p>
          </div>
          <div className={cls.byMonth}>
            <div>
              <img src={coinsicon} alt="coins" />
              <p>{expenses?.monthly_expenses}</p>
            </div>
            <p>Расходы за {currentMonth}</p>
          </div>
        </section>
        <SubscriptionsTabs />
      </main>
    </Suspense>
  );
});

export default MySubscriptionsPage;

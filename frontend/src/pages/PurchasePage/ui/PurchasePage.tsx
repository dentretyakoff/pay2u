import { Suspense, memo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Header } from "components/Header/Header";
import { Loader } from "widgets/Loader/Loader";
import { useGetSeparateServiceQuery } from "services/ServicesService";
import { PurchaseGuideDialog } from "components/PurchaseGuideDialog/PurchaseGuideDialog";
import sbp from "shared/assets/icons/logo-sbp.svg";
import ruble from "shared/assets/icons/ruble-sign.svg";
import cls from "./PurchasePage.module.scss";

const PurchasePage = memo(() => {
  const { id, subscriptionId } = useParams();
  const { data: service } = useGetSeparateServiceQuery(id || "");

  const [isAgreed, setIsAgreed] = useState(false);

  const chosenPlan = service?.subscriptions?.find(
    (plan) => plan.id === Number(subscriptionId)
  );

  const cashbackPercentage =
    chosenPlan?.price && chosenPlan?.cashback
      ? chosenPlan.price / chosenPlan.cashback
      : 0;

  const handleClick = () => {
    setIsAgreed(!isAgreed);
  };

  return (
    <Suspense fallback={<Loader />}>
      <main className={cls.PurchasePage}>
        <Header path={`/services/${id}`} title="Оформление" />
        <div className={cls.innerContainer}>
          <div className={cls.upperPart}>
            <div className={cls.title}>
              <img src={service?.image} alt="logo" />
              <h2>{service?.name}</h2>
            </div>
            <p className={cls.subscription}>{chosenPlan?.name}</p>
            <div className={cls.priceContainer}>
              <p className={cls.price}>{chosenPlan?.price} ₽</p>
              <p className={cls.cashback}>
                Кешбэк {cashbackPercentage}
                <img src={ruble} alt="ruble" />
              </p>
            </div>
            <p className={cls.paymentMethod}>СПОСОБ ОПЛАТЫ</p>
            <div className={cls.methodItem}>
              <img src={sbp} alt="sbp logo" />
              <p>Система быстрых платежей</p>
            </div>
            <PurchaseGuideDialog />
            <div className={cls.agreement}>
              <div className={cls.customCheckbox}>
                <input
                  type="checkbox"
                  id="custom-checkbox-1"
                  onClick={handleClick}
                />
                <label htmlFor="custom-checkbox-1" />
              </div>
              <p className={cls.agreementText}>
                Согласен с <Link to="/">правилами партнера.</Link>
              </p>
            </div>
          </div>
          <div className={cls.lowerPart}>
            <button disabled={!isAgreed} type="button" className={cls.button}>
              К выбору счета
            </button>
            <Link to="/" className={cls.link}>
              Оплачивая, вы соглашаетесь с Политикой обработки персональных
              данных.
            </Link>
          </div>
        </div>
      </main>
    </Suspense>
  );
});

export default PurchasePage;

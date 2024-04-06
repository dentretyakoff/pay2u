import { SyntheticEvent, memo, useState } from "react";
import { CustomTabPanel } from "components/CustomTabPanel/CustomTabPanel";
import { useGetMySubscriptionsQuery } from "services/MySubscriptions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./SubscriptionsTabs.scss";
import { ActiveServiceCard } from "components/ActiveServiceCard/ActiveServiceCard";

export const SubscriptionsTabs = memo(() => {
  const { data: userSubs = [] } = useGetMySubscriptionsQuery();

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const singleSubscription = userSubs?.filter(
    (sub) => sub.renewal_status === false
  );

  const autoRenewal = userSubs?.filter((sub) => sub.renewal_status === true);

  const disabledSubscriptions = userSubs?.filter((sub) => sub.status === false);

  return (
    <section>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        <Tab label="Активные" />
        <Tab label="Неактивные" />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        {userSubs?.length ? (
          <>
            {singleSubscription?.length && (
              <>
                <p className="section">Разовые</p>
                {singleSubscription?.map((sub) => (
                  <ActiveServiceCard data={sub} key={sub.id} />
                ))}
              </>
            )}
            {autoRenewal?.length && (
              <>
                <p className="section">Автопродление</p>
                {autoRenewal?.map((sub) => (
                  <ActiveServiceCard data={sub} key={sub.id} />
                ))}
              </>
            )}
          </>
        ) : (
          <p className="notFound">Нет активных подписок</p>
        )}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {disabledSubscriptions?.length ? (
          disabledSubscriptions?.map((sub) => (
            <ActiveServiceCard data={sub} key={sub.id} inactive />
          ))
        ) : (
          <p className="notFound">Нет неактивных подписок</p>
        )}
      </CustomTabPanel>
    </section>
  );
});

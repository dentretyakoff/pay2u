import { SyntheticEvent, memo, useState } from "react";
import { CustomTabPanel } from "components/CustomTabPanel/CustomTabPanel";
import { useGetMySubscriptionsQuery } from "services/MySubscriptions";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./SubscriptionsTabs.scss";
import { ActiveServiceCard } from "components/ActiveServiceCard/ActiveServiceCard";

export const SubscriptionsTabs = memo(() => {
  const { data: userSubs } = useGetMySubscriptionsQuery();

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
  return (
    <section>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        <Tab label="Активные" />
        <Tab label="Неактивные" />
      </Tabs>
      <CustomTabPanel value={value} index={0}>
        {userSubs?.map((sub) => (
          <ActiveServiceCard data={sub} key={sub.id} />
        ))}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        Item Two
      </CustomTabPanel>
    </section>
  );
});

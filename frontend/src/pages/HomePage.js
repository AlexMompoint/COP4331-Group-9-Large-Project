import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import ScheduleUI from '../components/ScheduleUI';
import GroupUI from '../components/GroupUI';

const HomePage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
            <ScheduleUI />
            <GroupUI />
        </div>
    );
}

export default HomePage;
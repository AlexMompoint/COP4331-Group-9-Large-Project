import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import ScheduleUI from '../components/ScheduleUI';
import GroupAdd from '../components/GroupAdd';

const HomePage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
            <ScheduleUI />
            <GroupAdd />
        </div>
    );
}

export default HomePage;
import React from 'react';

import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
import GroupUI from '../components/GroupUI';

const HomePage = () =>
{
    return(
        <div>
            <PageTitle />
            <LoggedInName />
            <GroupUI />
        </div>
    );
}

export default HomePage;
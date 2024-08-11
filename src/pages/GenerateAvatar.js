import { useMemo } from 'react';
import { createAvatar } from '@dicebear/core';
import { lorelei, avataaars, adventurer } from '@dicebear/collection';

import React from 'react'
import { Tooltip } from '@mui/material';

function GenerateAvatar({username}) {
    console.log("avatar",username);
    const avatar = useMemo(() => {
        return createAvatar(adventurer, {
            seed:username,
            size: 64,
            eyes: ["variant04"],
            mouth: ['variant15']
        }).toDataUri();
    }, [username]);
    return (
        <div>
            <Tooltip title={username}>
                <img src={avatar} alt={`Avatar for ${username}`} />
            </Tooltip>            
        </div>
    )
}

export default GenerateAvatar
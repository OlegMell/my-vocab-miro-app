'use client'

import React from 'react';
import { Tooltip as ReactTooltip } from "react-tooltip";

export const Footer = () => {
    return (
        <div className="footer">
            <span data-tooltip-id='feedbackTooltip' className='icon icon-comment-feedback'></span>

            <ReactTooltip
                clickable={true}
                id="feedbackTooltip"
                place="top"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            >
                Send feedback and bug reports to: <br /> <a href='mailto:oleg.mell.work@gmail.com'>oleg.mell.work@gmail.com</a>
            </ReactTooltip>
        </div>
    )
}
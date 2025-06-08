'use client'

import React, { useEffect, useRef } from 'react';
import { Tooltip as ReactTooltip, TooltipRefProps } from "react-tooltip";

export const Footer = () => {

    const tooltipRef = useRef<TooltipRefProps>( null );

    useEffect( () => {
        const timeout = setTimeout( () => {
            tooltipRef.current?.open();
        }, 3000 );

        return () => clearTimeout(timeout);
    }, [] );

    return (
        <div className="footer">
            <span data-tooltip-id='feedbackTooltip' className='icon icon-comment-feedback'></span>

            <ReactTooltip
                ref={tooltipRef}
                clickable={true}
                id="feedbackTooltip"
                place="top"
                style={{ backgroundColor: '#090909', color: '#fff' }}
            >
                Send feedback and bug reports to: <br /> <a>oleg.mell.work@gmail.com</a>
            </ReactTooltip>
        </div>
    )
}
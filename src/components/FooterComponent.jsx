import { Footer } from 'antd/lib/layout/layout';
import React from 'react';
import { CUserNavIcon } from './header/Header';


export const FooterComponet = () =>
    <Footer style={{ position: 'fixed', zIndex: 3, width: '100%', bottom: 0 }}>
        <CUserNavIcon />
    </Footer>
"use client"
import React, { useState } from 'react';
import {
    DesktopOutlined,
    FileOutlined,
    PieChartOutlined,
    TeamOutlined,
    UserOutlined,
    LogoutOutlined,
    ProfileOutlined,
    SunOutlined,
    MoonOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme, ConfigProvider, Avatar, Dropdown, Switch, Space } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../ProtectedRoute';
import Link from 'next/link';

const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link href="/">Dashboard</Link>, 'dashboard', <PieChartOutlined />),
  getItem(<Link href="/reports">Reports</Link>, 'reports', <DesktopOutlined />),

  getItem('User', 'sub1', <UserOutlined />, [
    getItem(<Link href="/users/tom">Tom</Link>, 'tom'),
    getItem(<Link href="/users/bill">Bill</Link>, 'bill'),
    getItem(<Link href="/users/alex">Alex</Link>, 'alex'),
  ]),

  getItem('Team', 'sub2', <TeamOutlined />, [
    getItem(<Link href="/team/1">Team 1</Link>, 'team1'),
    getItem(<Link href="/team/2">Team 2</Link>, 'team2'),
  ]),

  getItem(<Link href="/files">Files</Link>, 'files', <FileOutlined />),
];

const MainLayoutInner: React.FC<{
    children: React.ReactNode;
    isDarkMode: boolean;
    setIsDarkMode: (value: boolean) => void
}> = ({ children, isDarkMode, setIsDarkMode }) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const { data: session, status } = useSession();
    const router = useRouter();

    const userMenu: MenuProps['items'] = [
        {
            key: 'profile',
            icon: <ProfileOutlined />,
            label: 'Profile',
        },
        {
            key: 'logout',
            icon: <LogoutOutlined />,
            label: 'Logout',
            onClick: async () => {
                await signOut({ redirect: true, callbackUrl: '/login' });
            }
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
                <div className="demo-logo-vertical" />
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
            </Sider>
            <Layout>
                <Header style={
                    {
                        padding: '0 16px',
                        background: colorBgContainer,
                        marginBottom: 10,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }
                }>
                    <div>
                        <Switch
                            checked={isDarkMode}
                            onChange={setIsDarkMode}
                            checkedChildren={<MoonOutlined />}
                            unCheckedChildren={<SunOutlined />}
                        />
                    </div>
                    <div>
                        {status === 'authenticated' && session?.user && (
                            <Dropdown menu={{ items: userMenu }} placement="bottomRight">
                                <Space style={{ cursor: 'pointer' }}>
                                    <span style={{ marginRight: '8px' }}>{session.user.name || session.user.phone}</span>
                                    <Avatar icon={<UserOutlined />} />
                                </Space>
                            </Dropdown>
                        )}
                    </div>
                </Header>
                <Content style={{ margin: '0 16px' }}>
                    {/* <Breadcrumb style={{ margin: '16px 0' }} items={[{ title: 'User' }, { title: 'Bill' }]} /> */}
                    <div
                        style={{
                            padding: 24,
                            minHeight: 360,
                            background: colorBgContainer,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        {children}
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    Space Devs ©{new Date().getFullYear()} Created by Space Devs
                </Footer>
            </Layout>
        </Layout>
    );
}

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    return (
        <ConfigProvider
            theme={{
                algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
            }}
        >
            <ProtectedRoute>
                <MainLayoutInner
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                >
                    {children}
                </MainLayoutInner>
            </ProtectedRoute>
        </ConfigProvider>
    );
};

export default MainLayout;
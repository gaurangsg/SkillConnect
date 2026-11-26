import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  FaArrowRight,
  FaChartLine,
  FaClipboardList,
  FaClock,
  FaSearch,
  FaStar,
  FaSyncAlt,
  FaUserFriends,
  FaUsers,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {
  assignAdminWorker,
  getAdminBookings,
  getAdminOverview,
  getAdminUsers,
  getAdminWorkers,
  updateBookingStatus,
} from '../api/client';

const navigation = [
  { id: 'overview', label: 'Overview', icon: <FaChartLine /> },
  { id: 'orders', label: 'Orders', icon: <FaClipboardList /> },
  { id: 'workforce', label: 'Workforce', icon: <FaUsers /> },
  { id: 'accounts', label: 'Accounts', icon: <FaUserFriends /> },
];

const statusColor = { pending: 'warning', confirmed: 'info', completed: 'success', cancelled: 'default' };
const shortDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};
const orderReference = (id) => `SC-${String(id || '').slice(-6).toUpperCase()}`;

function MetricCard({ label, value, detail, icon, tone = 'green' }) {
  return (
    <Card className={`admin-metric-card tone-${tone}`} elevation={0}>
      <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography className="admin-metric-label">{label}</Typography>
          <Typography className="admin-metric-value">{value ?? '—'}</Typography>
          <Typography className="admin-metric-detail">{detail}</Typography>
        </Box>
        <Avatar className="admin-metric-icon">{icon}</Avatar>
      </Stack>
    </Card>
  );
}

function getLastSixMonths(rows = []) {
  const counts = new Map(rows.map((item) => [item.month, item.count]));
  const now = new Date();
  return Array.from({ length: 6 }, (_value, index) => {
    const date = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5 + index, 1));
    const key = date.toISOString().slice(0, 7);
    return { key, label: date.toLocaleDateString([], { month: 'short', timeZone: 'UTC' }), count: counts.get(key) || 0 };
  });
}

function EmptyTable({ columns, message }) {
  return <TableRow><TableCell colSpan={columns} align="center" sx={{ py: 5, color: 'text.secondary' }}>{message}</TableCell></TableRow>;
}

function OrderStatusChip({ status }) {
  return <Chip size="small" color={statusColor[status] || 'default'} label={status || 'unknown'} sx={{ textTransform: 'capitalize', fontWeight: 750 }} />;
}

export default function AdminDashboardPage({ session, onOpenAuth, onLogout, notify }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [overview, setOverview] = useState(null);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const [overviewError, setOverviewError] = useState('');
  const [overviewRefresh, setOverviewRefresh] = useState(0);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState('');
  const [ordersPage, setOrdersPage] = useState(1);
  const [ordersPages, setOrdersPages] = useState(1);
  const [ordersTotal, setOrdersTotal] = useState(0);
  const [ordersStatus, setOrdersStatus] = useState('');
  const [ordersSearchInput, setOrdersSearchInput] = useState('');
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersRefresh, setOrdersRefresh] = useState(0);
  const [updatingOrder, setUpdatingOrder] = useState('');

  const [workforce, setWorkforce] = useState({ profiles: [], availableAccounts: [] });
  const [workforceLoading, setWorkforceLoading] = useState(false);
  const [workforceError, setWorkforceError] = useState('');
  const [workforceRefresh, setWorkforceRefresh] = useState(0);
  const [selectedAccounts, setSelectedAccounts] = useState({});
  const [assigningWorker, setAssigningWorker] = useState('');

  const [accounts, setAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);
  const [accountsError, setAccountsError] = useState('');
  const [accountsPage, setAccountsPage] = useState(1);
  const [accountsPages, setAccountsPages] = useState(1);
  const [accountsTotal, setAccountsTotal] = useState(0);
  const [accountsRole, setAccountsRole] = useState('');
  const [accountsSearchInput, setAccountsSearchInput] = useState('');
  const [accountsSearch, setAccountsSearch] = useState('');
  const [accountsRefresh, setAccountsRefresh] = useState(0);

  const isAdmin = session.user?.role === 'admin';
  const months = useMemo(() => getLastSixMonths(overview?.ordersByMonth), [overview?.ordersByMonth]);
  const maxMonthlyOrders = Math.max(1, ...months.map((month) => month.count));
  const metrics = overview?.metrics;

  useEffect(() => {
    if (!session.token || !isAdmin) return undefined;
    let active = true;
    setOverviewLoading(true);
    setOverviewError('');
    getAdminOverview(session.token)
      .then((result) => { if (active) setOverview(result); })
      .catch((error) => { if (active) setOverviewError(error.message || 'Platform overview could not be loaded.'); })
      .finally(() => { if (active) setOverviewLoading(false); });
    return () => { active = false; };
  }, [isAdmin, overviewRefresh, session.token]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setOrdersSearch(ordersSearchInput.trim());
      setOrdersPage(1);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [ordersSearchInput]);

  useEffect(() => {
    if (activeTab !== 'orders' || !session.token || !isAdmin) return undefined;
    let active = true;
    setOrdersLoading(true);
    setOrdersError('');
    getAdminBookings(session.token, { page: ordersPage, limit: 10, status: ordersStatus, search: ordersSearch })
      .then((result) => {
        if (!active) return;
        setOrders(result.items || []);
        setOrdersTotal(result.total || 0);
        setOrdersPages(Math.max(result.pages || 1, 1));
      })
      .catch((error) => { if (active) setOrdersError(error.message || 'Orders could not be loaded.'); })
      .finally(() => { if (active) setOrdersLoading(false); });
    return () => { active = false; };
  }, [activeTab, isAdmin, ordersPage, ordersRefresh, ordersSearch, ordersStatus, session.token]);

  useEffect(() => {
    if (activeTab !== 'workforce' || !session.token || !isAdmin) return undefined;
    let active = true;
    setWorkforceLoading(true);
    setWorkforceError('');
    getAdminWorkers(session.token)
      .then((result) => { if (active) setWorkforce(result); })
      .catch((error) => { if (active) setWorkforceError(error.message || 'Workforce data could not be loaded.'); })
      .finally(() => { if (active) setWorkforceLoading(false); });
    return () => { active = false; };
  }, [activeTab, isAdmin, session.token, workforceRefresh]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setAccountsSearch(accountsSearchInput.trim());
      setAccountsPage(1);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [accountsSearchInput]);

  useEffect(() => {
    if (activeTab !== 'accounts' || !session.token || !isAdmin) return undefined;
    let active = true;
    setAccountsLoading(true);
    setAccountsError('');
    getAdminUsers(session.token, { page: accountsPage, limit: 10, role: accountsRole, search: accountsSearch })
      .then((result) => {
        if (!active) return;
        setAccounts(result.items || []);
        setAccountsTotal(result.total || 0);
        setAccountsPages(Math.max(result.pages || 1, 1));
      })
      .catch((error) => { if (active) setAccountsError(error.message || 'Accounts could not be loaded.'); })
      .finally(() => { if (active) setAccountsLoading(false); });
    return () => { active = false; };
  }, [accountsPage, accountsRefresh, accountsRole, accountsSearch, activeTab, isAdmin, session.token]);

  const refreshCurrentTab = () => {
    if (activeTab === 'overview') setOverviewRefresh((value) => value + 1);
    if (activeTab === 'orders') setOrdersRefresh((value) => value + 1);
    if (activeTab === 'workforce') setWorkforceRefresh((value) => value + 1);
    if (activeTab === 'accounts') setAccountsRefresh((value) => value + 1);
  };

  const changeOrderStatus = async (booking, status) => {
    setUpdatingOrder(booking._id);
    try {
      await updateBookingStatus(session.token, booking._id, status);
      notify(`Order ${orderReference(booking._id)} marked ${status}.`);
      setOrdersRefresh((value) => value + 1);
      setOverviewRefresh((value) => value + 1);
    } catch (error) {
      setOrdersError(error.message || 'The order status could not be updated.');
    } finally {
      setUpdatingOrder('');
    }
  };

  const assignAccount = async (profile) => {
    const userId = selectedAccounts[profile.id];
    if (!userId) return;
    setAssigningWorker(profile.id);
    try {
      await assignAdminWorker(session.token, profile.id, userId);
      notify(`${profile.name} is now linked to a worker account.`);
      setSelectedAccounts((current) => ({ ...current, [profile.id]: '' }));
      setWorkforceRefresh((value) => value + 1);
      setOverviewRefresh((value) => value + 1);
    } catch (error) {
      setWorkforceError(error.message || 'The worker account could not be assigned.');
    } finally {
      setAssigningWorker('');
    }
  };

  if (!session.token) {
    return (
      <Box className="admin-access-page">
        <Card className="admin-access-card" elevation={0}>
          <Typography className="admin-eyebrow">SkillConnect operations</Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>Administrator sign-in required</Typography>
          <Typography color="text.secondary" sx={{ my: 2 }}>Sign in with an administrator account to manage orders, accounts, and worker assignments.</Typography>
          <Button variant="contained" onClick={onOpenAuth}>Sign in</Button>
        </Card>
      </Box>
    );
  }

  if (!isAdmin) {
    return (
      <Box className="admin-access-page">
        <Card className="admin-access-card" elevation={0}>
          <Typography className="admin-eyebrow">Restricted workspace</Typography>
          <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>Admin access required</Typography>
          <Typography color="text.secondary" sx={{ my: 2 }}>This account does not have permission to view platform operations.</Typography>
          <Button component={Link} to="/account" variant="contained">Return to my account</Button>
        </Card>
      </Box>
    );
  }

  const activeSection = navigation.find((item) => item.id === activeTab);

  return (
    <Box className="admin-console">
      <Box component="aside" className="admin-sidebar">
        <Box className="admin-brand">
          <span className="admin-brand-mark">S</span>
          <Box><Typography className="admin-brand-name">SkillConnect</Typography><Typography className="admin-brand-caption">OPERATIONS</Typography></Box>
        </Box>
        <Typography className="admin-nav-caption">WORKSPACE</Typography>
        <Stack spacing={0.75} className="admin-nav">
          {navigation.map((item) => (
            <Button key={item.id} className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)} startIcon={item.icon}>
              {item.label}
              {item.id === 'orders' && metrics?.pendingOrders > 0 && <span className="admin-nav-count">{metrics.pendingOrders}</span>}
            </Button>
          ))}
        </Stack>
        <Box className="admin-sidebar-bottom">
          <Box className="admin-user-card">
            <Avatar className="admin-user-avatar">{session.user?.name?.[0]?.toUpperCase() || 'A'}</Avatar>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography className="admin-user-name" noWrap>{session.user?.name || 'Administrator'}</Typography>
              <Typography className="admin-user-role">Platform admin</Typography>
            </Box>
          </Box>
          <Button className="admin-marketplace-link" component={Link} to="/">View marketplace <FaArrowRight size={12} /></Button>
          <Button className="admin-logout-link" onClick={onLogout}>Sign out</Button>
        </Box>
      </Box>

      <Box component="main" className="admin-main">
        <Box className="admin-topbar">
          <Box>
            <Typography className="admin-breadcrumb">OPERATIONS <span>/</span> {activeSection?.label.toUpperCase()}</Typography>
            <Typography variant="h4" className="admin-page-title">{activeTab === 'overview' ? 'Platform overview' : activeSection?.label}</Typography>
          </Box>
          <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center' }}>
            <Chip className="admin-live-chip" label="Live data" size="small" />
            <Tooltip title="Refresh this view">
              <span><IconButton aria-label="Refresh admin view" onClick={refreshCurrentTab} disabled={overviewLoading && activeTab === 'overview'} className="admin-refresh-button"><FaSyncAlt size={14} /></IconButton></span>
            </Tooltip>
          </Stack>
        </Box>

        <Box className="admin-mobile-nav">
          {navigation.map((item) => <Button key={item.id} onClick={() => setActiveTab(item.id)} className={activeTab === item.id ? 'active' : ''}>{item.label}</Button>)}
        </Box>

        {activeTab === 'overview' && (
          <OverviewPanel
            data={overview}
            loading={overviewLoading}
            error={overviewError}
            maxMonthlyOrders={maxMonthlyOrders}
            months={months}
            onOpenOrders={() => setActiveTab('orders')}
            onOpenAccounts={() => setActiveTab('accounts')}
          />
        )}
        {activeTab === 'orders' && (
          <OrdersPanel
            bookings={orders}
            loading={ordersLoading}
            error={ordersError}
            page={ordersPage}
            pages={ordersPages}
            total={ordersTotal}
            status={ordersStatus}
            search={ordersSearchInput}
            updatingId={updatingOrder}
            onPageChange={(_event, page) => setOrdersPage(page)}
            onStatusChange={(event) => { setOrdersStatus(event.target.value); setOrdersPage(1); }}
            onSearchChange={(event) => setOrdersSearchInput(event.target.value)}
            onChangeStatus={changeOrderStatus}
          />
        )}
        {activeTab === 'workforce' && (
          <WorkforcePanel
            data={workforce}
            loading={workforceLoading}
            error={workforceError}
            selectedAccounts={selectedAccounts}
            assigningId={assigningWorker}
            onAccountChange={(workerId, accountId) => setSelectedAccounts((current) => ({ ...current, [workerId]: accountId }))}
            onAssign={assignAccount}
          />
        )}
        {activeTab === 'accounts' && (
          <AccountsPanel
            accounts={accounts}
            loading={accountsLoading}
            error={accountsError}
            page={accountsPage}
            pages={accountsPages}
            total={accountsTotal}
            role={accountsRole}
            search={accountsSearchInput}
            onPageChange={(_event, page) => setAccountsPage(page)}
            onRoleChange={(event) => { setAccountsRole(event.target.value); setAccountsPage(1); }}
            onSearchChange={(event) => setAccountsSearchInput(event.target.value)}
          />
        )}
      </Box>
    </Box>
  );
}

function OverviewPanel({ data, loading, error, maxMonthlyOrders, months, onOpenOrders, onOpenAccounts }) {
  const metrics = data?.metrics;
  const total = metrics?.orders || 0;
  const serviceBreakdown = data?.ordersByService || [];
  const maxServiceOrders = Math.max(1, ...serviceBreakdown.map((service) => service.count));
  return (
    <Box className="admin-content">
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box className="admin-metric-grid">
        {loading ? Array.from({ length: 4 }, (_value, index) => <Skeleton key={index} variant="rounded" height={142} />) : (
          <>
            <MetricCard label="Total orders" value={metrics?.orders} detail="All marketplace requests" icon={<FaClipboardList />} tone="green" />
            <MetricCard label="Awaiting action" value={metrics?.pendingOrders} detail="Requests needing review" icon={<FaClock />} tone="amber" />
            <MetricCard label="Customers" value={metrics?.customers} detail="Registered customer accounts" icon={<FaUsers />} tone="blue" />
            <MetricCard label="Worker accounts" value={metrics?.workerAccounts} detail={`${metrics?.assignedWorkerProfiles || 0} assigned to profiles`} icon={<FaUserFriends />} tone="violet" />
          </>
        )}
      </Box>

      <Box className="admin-secondary-stats">
        <span><b>{metrics?.workerProfiles ?? '—'}</b> professional profiles</span>
        <span><b>{metrics?.services ?? '—'}</b> service categories</span>
        <span><b>{metrics?.reviews ?? '—'}</b> reviews · <b>{Number(metrics?.averageRating || 0).toFixed(1)}</b> avg rating</span>
        <span><b>{metrics?.newsletterSubscribers ?? '—'}</b> newsletter subscribers</span>
      </Box>

      <Box className="admin-overview-grid">
        <Card className="admin-panel" elevation={0}>
          <Box className="admin-panel-heading">
            <Box><Typography className="admin-panel-title">Order volume</Typography><Typography className="admin-panel-subtitle">New bookings over the last six months</Typography></Box>
            <Chip size="small" label="6 months" />
          </Box>
          {loading ? <Skeleton variant="rounded" height={190} /> : (
            <Box className="admin-month-chart" aria-label="Orders by month">
              {months.map((month) => (
                <Box className="admin-month-column" key={month.key} aria-label={`${month.label}: ${month.count} orders`}>
                  <Typography className="admin-month-count">{month.count || ''}</Typography>
                  <Box className="admin-month-track"><Box className="admin-month-bar" sx={{ height: `${month.count ? Math.max(10, (month.count / maxMonthlyOrders) * 100) : 3}%` }} /></Box>
                  <Typography className="admin-month-label">{month.label}</Typography>
                </Box>
              ))}
            </Box>
          )}
        </Card>

        <Card className="admin-panel" elevation={0}>
          <Box className="admin-panel-heading">
            <Box><Typography className="admin-panel-title">Order status</Typography><Typography className="admin-panel-subtitle">Current request pipeline</Typography></Box>
            <Typography className="admin-status-total">{total} total</Typography>
          </Box>
          {loading ? <Skeleton variant="rounded" height={190} /> : (
            <Stack spacing={2.2} className="admin-status-list">
              {(data?.ordersByStatus || []).map((item) => (
                <Box key={item.status}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.7 }}>
                    <Typography className="admin-status-name">{item.status}</Typography><Typography className="admin-status-count">{item.count}</Typography>
                  </Stack>
                  <Box className={`admin-status-track status-${item.status}`}><Box sx={{ width: `${total ? (item.count / total) * 100 : 0}%` }} /></Box>
                </Box>
              ))}
              {total === 0 && <Typography color="text.secondary" variant="body2">Order activity will appear here as requests arrive.</Typography>}
            </Stack>
          )}
        </Card>
      </Box>

      <Box className="admin-overview-grid admin-bottom-grid">
        <Card className="admin-panel admin-table-panel" elevation={0}>
          <Box className="admin-panel-heading">
            <Box><Typography className="admin-panel-title">Recent orders</Typography><Typography className="admin-panel-subtitle">Latest customer requests</Typography></Box>
            <Button size="small" onClick={onOpenOrders} endIcon={<FaArrowRight size={11} />}>All orders</Button>
          </Box>
          {loading ? <Skeleton variant="rounded" height={220} /> : (
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow><TableCell>ORDER</TableCell><TableCell>SERVICE</TableCell><TableCell>CUSTOMER</TableCell><TableCell>STATUS</TableCell></TableRow></TableHead>
                <TableBody>
                  {(data?.recentOrders || []).map((booking) => (
                    <TableRow key={booking._id} hover>
                      <TableCell className="admin-mono">{orderReference(booking._id)}</TableCell>
                      <TableCell>{booking.serviceName}</TableCell>
                      <TableCell><span className="admin-table-primary">{booking.customerName}</span><span className="admin-table-secondary">{booking.customerEmail}</span></TableCell>
                      <TableCell><OrderStatusChip status={booking.status} /></TableCell>
                    </TableRow>
                  ))}
                  {!data?.recentOrders?.length && <EmptyTable columns={4} message="No orders yet. New requests will show up here." />}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Card>

        <Card className="admin-panel admin-recent-accounts" elevation={0}>
          <Box className="admin-panel-heading">
            <Box><Typography className="admin-panel-title">New accounts</Typography><Typography className="admin-panel-subtitle">Recently joined the platform</Typography></Box>
            <Button size="small" onClick={onOpenAccounts}>View all</Button>
          </Box>
          {loading ? <Skeleton variant="rounded" height={220} /> : (
            <Stack divider={<Divider flexItem />} spacing={0}>
              {(data?.recentUsers || []).map((user) => (
                <Stack key={user.id} direction="row" spacing={1.2} sx={{ alignItems: 'center', py: 1.35 }}>
                  <Avatar className={`admin-account-avatar role-${user.role}`}>{user.name?.[0]?.toUpperCase() || 'U'}</Avatar>
                  <Box sx={{ minWidth: 0, flex: 1 }}><Typography className="admin-table-primary" noWrap>{user.name}</Typography><Typography className="admin-table-secondary" noWrap>{user.email}</Typography></Box>
                  <Chip size="small" label={user.role} className={`admin-role-chip role-${user.role}`} />
                </Stack>
              ))}
              {!data?.recentUsers?.length && <Typography color="text.secondary" variant="body2" sx={{ py: 4, textAlign: 'center' }}>New accounts will appear here.</Typography>}
            </Stack>
          )}
        </Card>
      </Box>

      <Card className="admin-panel" elevation={0}>
        <Box className="admin-panel-heading">
          <Box><Typography className="admin-panel-title">Service demand</Typography><Typography className="admin-panel-subtitle">Most requested categories across all bookings</Typography></Box>
          <Chip size="small" label={`${serviceBreakdown.length} categories`} />
        </Box>
        {loading ? <Skeleton variant="rounded" height={150} sx={{ mx: 2, mb: 2 }} /> : serviceBreakdown.length ? (
          <Box className="admin-service-breakdown">
            {serviceBreakdown.map((service) => (
              <Box className="admin-service-item" key={service.serviceId}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.7 }}>
                  <Typography className="admin-status-name">{service.serviceName}</Typography>
                  <Typography className="admin-status-count">{service.count} {service.count === 1 ? 'order' : 'orders'}</Typography>
                </Stack>
                <Box className="admin-service-track"><Box sx={{ width: `${(service.count / maxServiceOrders) * 100}%` }} /></Box>
              </Box>
            ))}
          </Box>
        ) : <Typography color="text.secondary" variant="body2" sx={{ px: 2.5, pb: 2.5 }}>Service demand will appear once customers place orders.</Typography>}
      </Card>
    </Box>
  );
}

function OrdersPanel({ bookings, loading, error, page, pages, total, status, search, updatingId, onPageChange, onStatusChange, onSearchChange, onChangeStatus }) {
  return (
    <Box className="admin-content">
      <Card className="admin-panel" elevation={0}>
        <Box className="admin-panel-heading admin-orders-heading">
          <Box><Typography className="admin-panel-title">Marketplace orders</Typography><Typography className="admin-panel-subtitle">{total} requests across all statuses</Typography></Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} className="admin-table-filters">
            <TextField
              value={search}
              onChange={onSearchChange}
              size="small"
              placeholder="Search order, service, customer…"
              aria-label="Search all orders"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><FaSearch color="#7b8882" /></InputAdornment> } }}
              sx={{ minWidth: { xs: '100%', sm: 270 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel id="order-status-filter-label">Status</InputLabel>
              <Select labelId="order-status-filter-label" value={status} label="Status" onChange={onStatusChange}>
                <MenuItem value="">All statuses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="confirmed">Confirmed</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
        {error && <Alert severity="error" sx={{ mx: 2, mb: 2 }}>{error}</Alert>}
        <TableContainer className="admin-data-table">
          <Table size="small">
            <TableHead><TableRow><TableCell>ORDER</TableCell><TableCell>SERVICE</TableCell><TableCell>CUSTOMER</TableCell><TableCell>PROFESSIONAL</TableCell><TableCell>SCHEDULED</TableCell><TableCell>STATUS</TableCell><TableCell align="right">ACTIONS</TableCell></TableRow></TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={7} align="center" sx={{ py: 6 }}><CircularProgress size={24} /></TableCell></TableRow> : bookings.map((booking) => (
                <TableRow key={booking._id} hover>
                  <TableCell><span className="admin-mono">{orderReference(booking._id)}</span><span className="admin-table-secondary">{shortDate(booking.createdAt)}</span></TableCell>
                  <TableCell><span className="admin-table-primary">{booking.serviceName}</span><span className="admin-table-secondary">{booking.address}</span></TableCell>
                  <TableCell><span className="admin-table-primary">{booking.customerName}</span><span className="admin-table-secondary">{booking.customerEmail}</span></TableCell>
                  <TableCell><span className="admin-table-primary">{booking.workerName}</span><span className="admin-table-secondary">{booking.workerSkill}</span></TableCell>
                  <TableCell>{shortDate(booking.scheduledFor)}</TableCell>
                  <TableCell><OrderStatusChip status={booking.status} /></TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} sx={{ justifyContent: 'flex-end' }}>
                      {updatingId === booking._id ? <CircularProgress size={20} /> : (
                        <>
                          {booking.status === 'pending' && <Button size="small" onClick={() => onChangeStatus(booking, 'confirmed')}>Confirm</Button>}
                          {booking.status === 'confirmed' && <Button size="small" onClick={() => onChangeStatus(booking, 'completed')}>Complete</Button>}
                          {['pending', 'confirmed'].includes(booking.status) && <Button size="small" color="error" onClick={() => onChangeStatus(booking, 'cancelled')}>Cancel</Button>}
                        </>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && !bookings.length && <EmptyTable columns={7} message="No orders match the selected filters." />}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="admin-pagination"><Typography variant="body2">{total ? `${(page - 1) * 10 + 1}–${Math.min(page * 10, total)} of ${total}` : '0 orders'}</Typography>{pages > 1 && <Pagination page={page} count={pages} onChange={onPageChange} size="small" color="primary" />}</Box>
      </Card>
    </Box>
  );
}

function WorkforcePanel({ data, loading, error, selectedAccounts, assigningId, onAccountChange, onAssign }) {
  return (
    <Box className="admin-content">
      <Card className="admin-panel" elevation={0}>
        <Box className="admin-panel-heading">
          <Box><Typography className="admin-panel-title">Professional profiles</Typography><Typography className="admin-panel-subtitle">{data.profiles.length} profiles · {data.availableAccounts.length} worker accounts waiting to be linked</Typography></Box>
        </Box>
        {error && <Alert severity="error" sx={{ mx: 2, mb: 2 }}>{error}</Alert>}
        <TableContainer className="admin-data-table">
          <Table size="small">
            <TableHead><TableRow><TableCell>PROFESSIONAL</TableCell><TableCell>SPECIALTY</TableCell><TableCell>RATING</TableCell><TableCell>VERIFICATION</TableCell><TableCell>WORKER ACCOUNT</TableCell><TableCell align="right">ACTION</TableCell></TableRow></TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6 }}><CircularProgress size={24} /></TableCell></TableRow> : data.profiles.map((profile) => (
                <TableRow key={profile.id} hover>
                  <TableCell><span className="admin-table-primary">{profile.name}</span><span className="admin-table-secondary">{profile.id}</span></TableCell>
                  <TableCell>{profile.skill}</TableCell>
                  <TableCell><Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}><FaStar color="#d99936" size={13} />{Number(profile.rating || 0).toFixed(1)}</Stack></TableCell>
                  <TableCell><Chip size="small" label={profile.verified ? 'Verified' : 'Not verified'} color={profile.verified ? 'success' : 'default'} /></TableCell>
                  <TableCell>{profile.account ? <><span className="admin-table-primary">{profile.account.name}</span><span className="admin-table-secondary">{profile.account.email}</span></> : <Chip size="small" label="Unassigned" color="warning" />}</TableCell>
                  <TableCell align="right">
                    {!profile.account && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={0.75} sx={{ justifyContent: 'flex-end', alignItems: { sm: 'center' } }}>
                        <FormControl size="small" sx={{ minWidth: 190 }}>
                          <InputLabel id={`worker-account-${profile.id}`}>Worker account</InputLabel>
                          <Select labelId={`worker-account-${profile.id}`} value={selectedAccounts[profile.id] || ''} label="Worker account" onChange={(event) => onAccountChange(profile.id, event.target.value)}>
                            {data.availableAccounts.map((account) => <MenuItem key={account.id} value={account.id}>{account.name} · {account.email}</MenuItem>)}
                          </Select>
                        </FormControl>
                        <Button size="small" variant="contained" disabled={!selectedAccounts[profile.id] || assigningId === profile.id} onClick={() => onAssign(profile)}>
                          {assigningId === profile.id ? 'Linking…' : 'Link'}
                        </Button>
                      </Stack>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && !data.profiles.length && <EmptyTable columns={6} message="No professional profiles have been seeded yet." />}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}

function AccountsPanel({ accounts, loading, error, page, pages, total, role, search, onPageChange, onRoleChange, onSearchChange }) {
  return (
    <Box className="admin-content">
      <Card className="admin-panel" elevation={0}>
        <Box className="admin-panel-heading admin-orders-heading">
          <Box><Typography className="admin-panel-title">Platform accounts</Typography><Typography className="admin-panel-subtitle">{total} accounts in this view</Typography></Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} className="admin-table-filters">
            <TextField
              value={search}
              onChange={onSearchChange}
              size="small"
              placeholder="Search name or email"
              aria-label="Search accounts"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><FaSearch color="#7b8882" /></InputAdornment> } }}
              sx={{ minWidth: { xs: '100%', sm: 250 }, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <InputLabel id="account-role-filter-label">Role</InputLabel>
              <Select labelId="account-role-filter-label" value={role} label="Role" onChange={onRoleChange}>
                <MenuItem value="">All roles</MenuItem>
                <MenuItem value="customer">Customers</MenuItem>
                <MenuItem value="worker">Workers</MenuItem>
                <MenuItem value="admin">Administrators</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
        {error && <Alert severity="error" sx={{ mx: 2, mb: 2 }}>{error}</Alert>}
        <TableContainer className="admin-data-table">
          <Table size="small">
            <TableHead><TableRow><TableCell>ACCOUNT</TableCell><TableCell>EMAIL</TableCell><TableCell>ROLE</TableCell><TableCell>JOINED</TableCell></TableRow></TableHead>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6 }}><CircularProgress size={24} /></TableCell></TableRow> : accounts.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell><Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}><Avatar className={`admin-account-avatar role-${account.role}`}>{account.name?.[0]?.toUpperCase() || 'U'}</Avatar><span className="admin-table-primary">{account.name}</span></Stack></TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell><Chip size="small" label={account.role} className={`admin-role-chip role-${account.role}`} /></TableCell>
                  <TableCell>{shortDate(account.createdAt)}</TableCell>
                </TableRow>
              ))}
              {!loading && !accounts.length && <EmptyTable columns={4} message="No accounts match your filters." />}
            </TableBody>
          </Table>
        </TableContainer>
        <Box className="admin-pagination"><Typography variant="body2">{total ? `${(page - 1) * 10 + 1}–${Math.min(page * 10, total)} of ${total}` : '0 accounts'}</Typography>{pages > 1 && <Pagination page={page} count={pages} onChange={onPageChange} size="small" color="primary" />}</Box>
      </Card>
    </Box>
  );
}

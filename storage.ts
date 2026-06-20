const normalizeId = (id: string) => id ? id.trim().toLowerCase() : "";

const getLocal = (key: string) => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem(`gk_mock_${key}`) || "[]");
};

const setLocal = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`gk_mock_${key}`, JSON.stringify(data));
  }
};

const DEFAULT_METRICS = [
  { key: 'ownership', label: 'Ownership על היעדים', icon: '🎯' },
  { key: 'roleClarity', label: 'בהירות בתחומי אחריות', icon: '📋' },
  { key: 'routines', label: 'שגרות וסדר יום', icon: '🔄' },
  { key: 'trust', label: 'אמון וכבוד הדדי', icon: '✨' },
  { key: 'commitment', label: 'רמת מחויבות לצוות', icon: '🤝' },
  { key: 'openComm', label: 'תקשורת פתוחה וכנה', icon: '🗣️' }
];

const getSystemConfig = async () => {
  const defaultConfig = { 
    masterCode: "GILAD2025", 
    feedback360Url: "https://ubiquitous-nougat-41808d.netlify.app/",
    communicationDnaUrl: "https://hilarious-kashata-9aafa2.netlify.app/",
    metrics: DEFAULT_METRICS,
    articles: [],
    clients: [],
    collaborations: []
  };

  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('gk_mock_system_config');
    if (local) return { ...defaultConfig, ...JSON.parse(local) };
  }
  return defaultConfig;
};

const updateSystemConfig = async (config: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('gk_mock_system_config', JSON.stringify(config));
  }
};

const createWorkspace = async (teamId: string, password: string) => {
  const tid = normalizeId(teamId);
  const workspaces = getLocal('workspaces');
  if (workspaces.find((w: any) => w.id === tid)) return { success: false, error: "מרחב כבר קיים" };
  setLocal('workspaces', [...workspaces, { id: tid, password, createdAt: Date.now() }]);
  return { success: true };
};

const loginToWorkspace = async (teamId: string, password: string) => {
  const tid = normalizeId(teamId);
  const workspaces = getLocal('workspaces');
  const ws = workspaces.find((w: any) => w.id === tid && w.password === password);
  if (ws) return { success: true };
  return { success: false, error: "פרטים שגויים" };
};

const checkWorkspaceExists = async (teamId: string) => {
  const tid = normalizeId(teamId);
  const workspaces = getLocal('workspaces');
  return workspaces.some((w: any) => w.id === tid);
};

const syncToCloud = async (collectionName: string, data: any) => {
  const list = getLocal(collectionName);
  const id = data.id || Math.random().toString(36).substr(2, 9);
  const index = list.findIndex((item: any) => item.id === id);
  const newItem = { ...data, id, updatedAt: Date.now() };
  if (index > -1) list[index] = newItem;
  else list.push(newItem);
  setLocal(collectionName, list);
};

const fetchFromCloud = async (collectionName: string, managerId: string) => {
  const mid = normalizeId(managerId);
  const list = getLocal(collectionName);
  return list.filter((item: any) => normalizeId(item.managerId) === mid);
};

const deleteFromCloud = async (collectionName: string, id: string) => {
  const list = getLocal(collectionName);
  setLocal(collectionName, list.filter((item: any) => item.id !== id));
};

const saveTeamPulse = async (teamId: string, data: any) => {
  const tid = normalizeId(teamId);
  const pulses = getLocal('team_pulses');
  pulses.push({ teamId: tid, ...data, timestamp: Date.now() });
  setLocal('team_pulses', pulses);
  return true;
};

const getTeamPulses = async (teamId: string) => {
  const tid = normalizeId(teamId);
  const pulses = getLocal('team_pulses');
  return pulses.filter((p: any) => normalizeId(p.teamId) === tid).sort((a: any, b: any) => b.timestamp - a.timestamp);
};

export {
  DEFAULT_METRICS,
  getSystemConfig,
  updateSystemConfig,
  createWorkspace,
  loginToWorkspace,
  checkWorkspaceExists,
  syncToCloud,
  fetchFromCloud,
  deleteFromCloud,
  saveTeamPulse,
  getTeamPulses
};

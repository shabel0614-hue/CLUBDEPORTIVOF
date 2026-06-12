import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { userService } from '../../services/userService';
import { clubService } from '../../services/clubService';
import type { UserDto, UpdateUserDto } from '../../types/auth';
import type { ClubResponseDto } from '../../types/club';
import Seo from '../../components/Seo';

const roleOptions = ['Usuario', 'Fundador', 'Admin'] as const;
const memberTypes = ['Estudiante', 'Docente', 'Administrativo'] as const;
const academicUnits = ['Sistemas', 'Ingeniería Civil', 'Ingeniería Industrial', 'Medicina', 'Derecho', 'Administración de Empresas', 'Arquitectura', 'Comunicación'] as const;

type RoleOption = (typeof roleOptions)[number];
type MemberType = (typeof memberTypes)[number];
type AcademicUnit = (typeof academicUnits)[number];

type EditedUserState = {
  role: RoleOption;
  foundedClubId?: string | null;
};

type NewUserForm = {
  name: string;
  email: string;
  password: string;
  role: RoleOption;
  institutionalCode: string;
  memberType: MemberType;
  academicUnit: AcademicUnit;
};

const UserManagement = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserDto[]>([]);
  const [clubs, setClubs] = useState<ClubResponseDto[]>([]);
  const [editedUsers, setEditedUsers] = useState<Record<string, EditedUserState>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [newUser, setNewUser] = useState<NewUserForm>({ name: '', email: '', password: '', role: 'Usuario', institutionalCode: '', memberType: 'Estudiante', academicUnit: 'Sistemas' });
  const [newUserErrors, setNewUserErrors] = useState<Partial<Record<keyof NewUserForm, string>>>({});
  const [creatingUser, setCreatingUser] = useState(false);

  useEffect(() => {
    document.title = 'Gestión de Usuarios - Admin';
  }, []);

  useEffect(() => {
    if (!loading && user?.role !== 'Admin') {
      navigate('/dashboard');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (loading || user?.role !== 'Admin') return;
    const loadData = async () => {
      try {
        const [usersFromApi, clubsFromApi] = await Promise.all([userService.getAll(), clubService.getAll()]);
        setUsers(usersFromApi);
        setClubs(clubsFromApi);
      } catch {
        setFetchError('No fue posible cargar los usuarios o clubes. Intenta de nuevo más tarde.');
      }
    };
    void loadData();
  }, [loading, user?.role]);

  const handleRoleChange = (userId: string, newRole: RoleOption) => {
    setEditedUsers((current) => ({
      ...current,
      [userId]: {
        ...current[userId],
        role: newRole,
        foundedClubId: newRole !== 'Fundador' ? null : current[userId]?.foundedClubId,
      },
    }));
  };

  const handleFounderClubChange = (userId: string, foundedClubId?: string) => {
    setEditedUsers((current) => ({
      ...current,
      [userId]: {
        ...current[userId],
        role: current[userId]?.role ?? 'Fundador',
        foundedClubId: foundedClubId || null,
      },
    }));
  };

  const saveRole = async (userId: string) => {
    const currentUser = users.find((u) => u.id === userId);
    if (!currentUser) return;

    const editState = editedUsers[userId];
    const newRole = editState?.role ?? currentUser.role;
    const newFoundedClubId = editState?.foundedClubId ?? currentUser.foundedClubId ?? null;
    if (newRole === currentUser.role && newFoundedClubId === currentUser.foundedClubId) return;

    if (newRole === 'Fundador' && !newFoundedClubId) {
      setFeedback({ type: 'error', message: 'Selecciona un club antes de asignar el rol Fundador.' });
      return;
    }

    setSaving((current) => ({ ...current, [userId]: true }));
    try {
      const updatePayload: UpdateUserDto = { role: newRole };
      if (newRole === 'Fundador') updatePayload.foundedClubId = newFoundedClubId;
      const updatedUser = await userService.update(userId, updatePayload);
      setUsers((prev) => prev.map((u) => (u.id === userId ? updatedUser : u)));
      setEditedUsers((current) => {
        const next = { ...current };
        delete next[userId];
        return next;
      });
      setFeedback({ type: 'success', message: `Rol actualizado a ${newRole} correctamente.` });
    } catch {
      setFeedback({ type: 'error', message: 'No se pudo actualizar el rol. Intenta de nuevo.' });
    } finally {
      setSaving((current) => ({ ...current, [userId]: false }));
    }
  };

  const currentRole = (userItem: UserDto) => editedUsers[userItem.id]?.role ?? userItem.role;
  const currentFoundedClubId = (userItem: UserDto) => editedUsers[userItem.id]?.foundedClubId ?? userItem.foundedClubId ?? '';

  const handleNewUserChange = (field: keyof NewUserForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setNewUser((prev) => ({ ...prev, [field]: event.target.value }));
      setNewUserErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const validateNewUser = (): boolean => {
    const errors: Partial<Record<keyof NewUserForm, string>> = {};
    if (!newUser.name.trim()) errors.name = 'El nombre es obligatorio.';
    if (!newUser.email.trim()) errors.email = 'El email es obligatorio.';
    if (!newUser.password.trim()) errors.password = 'La contraseña es obligatoria.';
    if (!newUser.institutionalCode.trim()) errors.institutionalCode = 'El código institucional es obligatorio.';
    setNewUserErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);
    if (!validateNewUser()) return;

    setCreatingUser(true);
    try {
      await authService.register({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        institutionalCode: newUser.institutionalCode,
        memberType: newUser.memberType,
        academicUnit: newUser.academicUnit,
      });
      setFeedback({ type: 'success', message: 'Usuario creado correctamente.' });
      setNewUser({ name: '', email: '', password: '', role: 'Usuario', institutionalCode: '', memberType: 'Estudiante', academicUnit: 'Sistemas' });
      const usersFromApi = await userService.getAll();
      setUsers(usersFromApi);
    } catch {
      setFeedback({ type: 'error', message: 'No se pudo crear el usuario. Intenta nuevamente.' });
    } finally {
      setCreatingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="state-message">
        <div className="spinner" />
        <p>Verificando permisos...</p>
      </div>
    );
  }

  return (
    <div className="page-shell user-management-page">
      <Seo title="Admin - Gestión de usuarios" description="Panel administrativo para administrar roles de usuarios." />

      <div className="page-header">
        <div>
          <h1 className="page-title">Gestión de Usuarios</h1>
          <p className="page-subtitle">Cambia roles y designa fundadores desde la administración.</p>
        </div>
      </div>

      {fetchError && <div className="alert alert-error">{fetchError}</div>}
      {feedback && (
        <div className={`alert alert-${feedback.type}`}>
          {feedback.message}
          <button className="feedback-close" onClick={() => setFeedback(null)} type="button">✕</button>
        </div>
      )}

      <section className="create-user-section card">
        <div className="section-header">
          <div>
            <h2>Registrar nuevo usuario</h2>
            <p className="section-subtitle">Crea cuentas nuevas para personas, fundadores o administradores.</p>
          </div>
        </div>

        <form onSubmit={createUser} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="new-name">Nombre</label>
              <input id="new-name" className={`form-input ${newUserErrors.name ? 'input-error' : ''}`} value={newUser.name} onChange={handleNewUserChange('name')} />
              {newUserErrors.name && <span className="form-error">{newUserErrors.name}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="new-email">Email</label>
              <input id="new-email" type="email" className={`form-input ${newUserErrors.email ? 'input-error' : ''}`} value={newUser.email} onChange={handleNewUserChange('email')} />
              {newUserErrors.email && <span className="form-error">{newUserErrors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="new-password">Contraseña</label>
              <input id="new-password" type="password" className={`form-input ${newUserErrors.password ? 'input-error' : ''}`} value={newUser.password} onChange={handleNewUserChange('password')} />
              {newUserErrors.password && <span className="form-error">{newUserErrors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="new-role">Rol</label>
              <select id="new-role" className="form-select" value={newUser.role} onChange={handleNewUserChange('role')}>
                {roleOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="new-code">Código institucional</label>
              <input id="new-code" className={`form-input ${newUserErrors.institutionalCode ? 'input-error' : ''}`} value={newUser.institutionalCode} onChange={handleNewUserChange('institutionalCode')} />
              {newUserErrors.institutionalCode && <span className="form-error">{newUserErrors.institutionalCode}</span>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="new-memberType">Tipo de miembro</label>
              <select id="new-memberType" className="form-select" value={newUser.memberType} onChange={handleNewUserChange('memberType')}>
                {memberTypes.map((option) => (<option key={option} value={option}>{option}</option>))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="new-academicUnit">Unidad académica</label>
            <select id="new-academicUnit" className="form-select" value={newUser.academicUnit} onChange={handleNewUserChange('academicUnit')}>
              {academicUnits.map((option) => (<option key={option} value={option}>{option}</option>))}
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={creatingUser}>{creatingUser ? 'Creando usuario...' : 'Crear usuario'}</button>
          </div>
        </form>
      </section>

      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Fundador de club</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {users.map((userItem) => {
              const role = currentRole(userItem) as RoleOption;
              const foundedClubId = currentFoundedClubId(userItem);
              const roleChanged = role !== userItem.role || foundedClubId !== (userItem.foundedClubId ?? '');
              return (
                <tr key={userItem.id}>
                  <td>{userItem.name}</td>
                  <td>{userItem.email}</td>
                  <td>
                    <select className="form-select" value={role} onChange={(event) => handleRoleChange(userItem.id, event.target.value as RoleOption)}>
                      {roleOptions.map((option) => (<option key={option} value={option}>{option}</option>))}
                    </select>
                  </td>
                  <td>
                    {role === 'Fundador' ? (
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <select className="form-select" value={foundedClubId} onChange={(event) => handleFounderClubChange(userItem.id, event.target.value)}>
                          <option value="">Selecciona un club</option>
                          {clubs.map((club) => (<option key={club.id} value={club.id}>{club.name}</option>))}
                        </select>
                        {!foundedClubId && roleChanged && (<span className="form-error">Selecciona un club para Fundador.</span>)}
                      </div>
                    ) : ('—')}
                  </td>
                  <td>
                    <button type="button" className="btn btn-primary btn-sm save-button" onClick={() => void saveRole(userItem.id)} disabled={!roleChanged || saving[userItem.id] || (role === 'Fundador' && !foundedClubId)}>
                      {saving[userItem.id] ? 'Guardando...' : roleChanged ? 'Guardar' : 'Sin cambios'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};export default UserManagement;
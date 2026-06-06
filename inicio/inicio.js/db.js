/**
 * db.js — Base de datos de usuarios simulada con localStorage
 * Simula una tabla SQL: usuarios (id, nombre, correo, contraseña, telefono, fecha_registro)
 *
 * API pública:
 *   DB.init()                   — inicializa la BD
 *   DB.registrar(datos)         — inserta un usuario nuevo, retorna {ok, mensaje}
 *   DB.login(correo, password)  — autentica, retorna {ok, usuario, mensaje}
 *   DB.logout()                 — cierra sesión
 *   DB.sesionActual()           — retorna el usuario logueado o null
 *   DB.todos()                  — retorna todos los usuarios (sin contraseña)
 */

const DB = (() => {
    const TABLA   = 'optica_usuarios';
    const SESION  = 'optica_sesion';

    /* ── Helpers internos ── */
    function _leer()        { return JSON.parse(localStorage.getItem(TABLA) || '[]'); }
    function _guardar(rows) { localStorage.setItem(TABLA, JSON.stringify(rows)); }

    /* SHA-256 nativo del navegador (async) */
    async function _hash(texto) {
        const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
        return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('');
    }

    /* ── init ── */
    function init() {
        if (!localStorage.getItem(TABLA)) _guardar([]);
        console.log('[DB] Tabla de usuarios lista.');
    }

    /* ── registrar ── */
    async function registrar({ nombre, correo, password, telefono }) {
        if (!nombre || !correo || !password || !telefono)
            return { ok: false, mensaje: 'Todos los campos son obligatorios.' };

        const correoLimpio = correo.trim().toLowerCase();
        const filas = _leer();

        if (filas.find(u => u.correo === correoLimpio))
            return { ok: false, mensaje: 'Este correo ya está registrado.' };

        const hash = await _hash(password);
        const nuevo = {
            id: Date.now(),
            nombre: nombre.trim(),
            correo: correoLimpio,
            password: hash,
            telefono: telefono.trim(),
            fecha_registro: new Date().toISOString()
        };

        filas.push(nuevo);
        _guardar(filas);
        console.log('[DB] Usuario registrado:', nuevo.correo);
        return { ok: true, mensaje: 'Registro exitoso.' };
    }

    /* ── login ── */
    async function login(correo, password) {
        if (!correo || !password)
            return { ok: false, mensaje: 'Ingresa correo y contraseña.' };

        const correoLimpio = correo.trim().toLowerCase();
        const hash = await _hash(password);
        const filas = _leer();
        const usuario = filas.find(u => u.correo === correoLimpio && u.password === hash);

        if (!usuario)
            return { ok: false, mensaje: 'Correo o contraseña incorrectos.' };

        const sesion = { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo };
        sessionStorage.setItem(SESION, JSON.stringify(sesion));
        console.log('[DB] Sesión iniciada:', sesion.correo);
        return { ok: true, usuario: sesion, mensaje: 'Bienvenido/a, ' + usuario.nombre + '.' };
    }

    /* ── logout ── */
    function logout() {
        sessionStorage.removeItem(SESION);
        console.log('[DB] Sesión cerrada.');
    }

    /* ── sesionActual ── */
    function sesionActual() {
        const raw = sessionStorage.getItem(SESION);
        return raw ? JSON.parse(raw) : null;
    }

    /* ── todos (sin contraseña, solo para debug) ── */
    function todos() {
        return _leer().map(({ password, ...resto }) => resto);
    }

    return { init, registrar, login, logout, sesionActual, todos };
})();

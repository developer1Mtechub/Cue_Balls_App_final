import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation files
const resources = {
    en: {
        translation: {
            // English: "English",
            // Spanish: "Spanish",
            "Sign In to your Account": "Sign In to your Account",
            "Don’t have an account?": "Don’t have an account?",
            "Create Account": "Create Account",
            "Email Address": "Email Address",
            Password: "Password",
            "Forgot password?": "Forgot password?",
            "Sign In": "Sign In",
            or: "or",
            "Sign in With Google": "Sign in With Google",

            "Create your Account": "Create your Account",
            "Already have an account?": "Already have an account?",
            Username: "Username",
            "Confirm Password": "Confirm Password",
            "Create Account": "Create Account",
            "Signup With Google": "Signup With Google",

            "Dashboard": "Dashboard",
            "Wallet": "Wallet",
            "History": "History",
            "Edit Profile": "Edit Profile",
            "Change Password": "Change Password",
            "Contact Us": "Contact Us",
            "Privacy Policy": "Privacy Policy",
            "Terms & Conditions": "Terms & Conditions",
            "Delete Account": "Delete Account",

            "Available Balance": "Available Balance",
            "Total Played Games": "Total Played Games",
            "Won Games": "Won Games",
            "Lost Games": "Lost Games",

            "No games yet. 🎱 Get ready for action! Stay tuned. 🌟🔄": "No games yet. 🎱 Get ready for action! Stay tuned. 🌟🔄",

            "My Wallet": "My Wallet",
            "Your Balance": "Your Balance",
            "Withdraw": "Withdraw",
            "Deposit": "Deposit",
            "Transaction History": "Transaction History",
            "Transaction ID:": "Transaction ID:",

            "No history yet. 🎱 Prepare for legendary & unforgettable victories! 🌟": "No history yet. 🎱 Prepare for legendary & unforgettable victories! 🌟",

            "Email": "Email",
            "Old Password": "Old Password",
            "New Password": "New Password",
            "Change": "Change",

            "Contact Us": "Contact Us",
            "First Name": "First Name",
            "Last Name": "Last Name",
            "Message": "Message",
            "Send": "Send",

            "By deleting your account, you will lose access to all your data associated with this account. However, you have the option to retrieve your data within 90 days of deletion by sending an email request to our administrative team at": "By deleting your account, you will lose access to all your data associated with this account. However, you have the option to retrieve your data within 90 days of deletion by sending an email request to our administrative team at",
            "Cue-Ball@gmail.com": "Cue-Ball@gmail.com",
            "In the body of the email, provide the following complete profile credentials:": "In the body of the email, provide the following complete profile credentials:",
            "Full Name": "Full Name",
            "Please ensure that the provided information matches the details associated with your deleted account.": "Please ensure that the provided information matches the details associated with your deleted account.",
            "Are you sure to delete the account?": "Are you sure to delete the account?",
            "Yes, sure": "Yes, sure",

            "Do you want to logout?": "Do you want to logout?",
            "Cancel": "Cancel",
            "Logout": "Logout",

            "Withdraw Amount": "Withdraw Amount",
            "Continue": "Continue",
            "Deposit Amount": "Deposit Amount",

            "Play Game": "Play Game",
            "Change Language": "Change Language",
            "Select Language": "Select Language",

            "Waiting ...": "Waiting ...",
            "Restart Game": "Restart Game",
            "Game started": "Game started"
        },
    },
    es: {
        translation: {
            // English: "inglés",
            // Spanish: "española",
            "Sign In to your Account": "Inicia sesión en tu cuenta",
            "Don’t have an account?": "¿No tienes una cuenta?",
            "Create Account": "Crear una cuenta",
            "Email Address": "Dirección de correo electrónico",
            Password: "Contraseña",
            "Forgot password?": "¿Has olvidado tu contraseña?",
            "Sign In": "iniciar sesión",
            or: "o",
            "Sign in With Google": "iniciar sesión con google",

            "Create your Account": "Crea tu cuenta",
            "Already have an account?": "¿Ya tienes una cuenta?",
            Username: "Nombre de usuario",
            "Confirm Password": "confirmar Contraseña",
            "Create Account": "Crear una cuenta",
            "Signup With Google": "Regístrate con Google",

            "Dashboard": "Panel",
            "Wallet": "Billetera",
            "History": "Historia",
            "Edit Profile": "Editar perfil",
            "Change Password": "Cambiar la contraseña",
            "Contact Us": "Contacta con nosotras",
            "Privacy Policy": "política de privacidad",
            "Terms & Conditions": "Términos y condiciones",
            "Delete Account": "Eliminar cuenta",

            "Available Balance": "Saldo disponiblee",
            "Total Played Games": "Total de juegos jugados",
            "Won Games": "Juegos ganados",
            "Lost Games": "Juegos perdidos",

            "No games yet. 🎱 Get ready for action! Stay tuned. 🌟🔄": "Aún no hay juegos. 🎱 ¡Prepárate para la acción! Manténganse al tanto. 🌟🔄",

            "My Wallet": "Mi billetera",
            "Your Balance": "Tu saldo",
            "Withdraw": "Retirar",
            "Deposit": "Depósito",
            "Transaction History": "Historial de transacciones",
            "Transaction ID:": "ID de transacción:",

            "No history yet. 🎱 Prepare for legendary & unforgettable victories! 🌟": "Aún no hay antecedentes. 🎱 ¡Prepárate para victorias legendarias e inolvidables! 🌟",

            "Email": "Correo electrónico",
            "Old Password": "Contraseña anterior",
            "New Password": "Nueva contraseña",
            "Change": "Cambiar",

            "Contact Us": "Contacta con nosotras",
            "First Name": "Nombre de pila",
            "Last Name": "Apellido",
            "Message": "Mensaje",
            "Send": "Enviar",

            "By deleting your account, you will lose access to all your data associated with this account. However, you have the option to retrieve your data within 90 days of deletion by sending an email request to our administrative team at": "Al eliminar su cuenta, perderá el acceso a todos sus datos asociados con esta cuenta. Sin embargo, tiene la opción de recuperar sus datos dentro de los 90 días posteriores a la eliminación enviando una solicitud por correo electrónico a nuestro equipo administrativo a",
            "Cue-Ball@gmail.com": "Bola-cue@gmail.com",
            "In the body of the email, provide the following complete profile credentials:": "En el cuerpo del correo electrónico, proporcione las siguientes credenciales de perfil completas:",
            "Full Name": "Nombre completo",
            "Please ensure that the provided information matches the details associated with your deleted account.": "Asegúrese de que la información proporcionada coincida con los detalles asociados con su cuenta eliminada.",
            "Are you sure to delete the account?": "¿Estás segura de eliminar la cuenta?",
            "Yes, sure": "si, claro",

            "Do you want to logout?": "¿Quieres cerrar sesión?",
            "Cancel": "Cancelar",
            "Logout": "Cerrar sesión",

            "Withdraw Amount": "Retirar cantidad",
            "Continue": "Continuar",
            "Deposit Amount": "Monto del depósito",

            "Play Game": "jugar juego",
            "Change Language": "Cambiar idioma",
            "Select Language": "Seleccionar idioma",

            "Waiting ...": "Espera ....",
            "Restart Game": "Reiniciar juegoe",
            "Game started": "Juego iniciado"

        }
    }
};

const savedLang = localStorage.getItem('lang');

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: savedLang || 'en', // Set the language from localStorage or default to English
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // React already escapes values to prevent XSS
        }
    });

export default i18n;


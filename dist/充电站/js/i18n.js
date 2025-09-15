// Multi-language support system
const translations = {
    en: {
        brand: "EV Charge Hub",
        nav: {
            home: "Home",
            admin: "Admin Portal",
            company: "Company Portal", 
            userApp: "User App",
            about: "About"
        },
        hero: {
            title: "Global EV Charging Management Platform",
            subtitle: "Empowering charging networks worldwide with our comprehensive SaaS solution",
            demo: "Request Demo",
            features: "View Features"
        },
        stats: {
            stations: "Charging Stations",
            countries: "Countries",
            users: "Active Users"
        },
        features: {
            title: "Platform Features",
            global: "Global Coverage",
            globalDesc: "Support for multiple currencies, languages, and payment methods",
            analytics: "Real-time Analytics",
            analyticsDesc: "Comprehensive insights into your charging network performance",
            mobile: "Mobile First",
            mobileDesc: "Native apps for iOS and Android with seamless user experience",
            ocpp: "OCPP Compatible",
            ocppDesc: "Support for OCPP 1.6J and 2.0.1 protocols"
        },
        admin: {
            title: "Platform Admin Portal",
            dashboard: "Admin Dashboard",
            overview: "Overview",
            tenants: "Tenants",
            monitoring: "Monitoring",
            billing: "Billing",
            settings: "Settings",
            platformOverview: "Platform Overview",
            totalTenants: "Total Tenants",
            totalStations: "Total Stations",
            totalUsers: "Total Users",
            activeCharging: "Active Charging",
            platformGrowth: "Platform Growth",
            tenantManagement: "Tenant Management",
            addTenant: "Add Tenant",
            systemMonitoring: "System Monitoring",
            systemHealth: "System Health",
            operational: "All Systems Operational",
            apiStatus: "API Status",
            responseTime: "Response Time",
            uptime: "Uptime"
        },
        company: {
            title: "Company Portal",
            dashboard: "Company Dashboard",
            overview: "Overview",
            stations: "Stations",
            chargers: "Chargers",
            sessions: "Sessions",
            pricing: "Pricing",
            analytics: "Analytics",
            networkOverview: "Network Overview",
            totalStations: "Total Stations",
            totalChargers: "Total Chargers",
            activeCharging: "Active Charging",
            monthlyRevenue: "Monthly Revenue",
            stationMap: "Station Map",
            stationManagement: "Station Management",
            addStation: "Add Station",
            chargerManagement: "Charger Management",
            chargingSessions: "Charging Sessions",
            activeSessions: "Active Sessions",
            recentSessions: "Recent Sessions"
        },
        user: {
            appTitle: "EV Charge",
            searchStations: "Search charging stations...",
            viewList: "View List",
            chargingInProgress: "Charging in Progress",
            duration: "Duration",
            energy: "Energy",
            cost: "Cost",
            stopCharging: "Stop Charging",
            myVehicles: "My Vehicles",
            paymentMethods: "Payment Methods",
            chargingHistory: "Charging History",
            favorites: "Favorite Stations",
            settings: "Settings",
            map: "Map",
            scan: "Scan",
            activity: "Activity",
            wallet: "Wallet"
        },
        login: {
            email: "Email",
            password: "Password",
            companyId: "Company ID",
            remember: "Remember me",
            submit: "Sign In",
            forgot: "Forgot password?"
        },
        logout: "Logout",
        table: {
            id: "ID",
            companyName: "Company Name",
            country: "Country",
            stations: "Stations",
            users: "Users",
            status: "Status",
            actions: "Actions",
            chargerId: "Charger ID",
            station: "Station",
            type: "Type",
            power: "Power (kW)",
            currentUser: "Current User"
        },
        modal: {
            addTenant: "Add New Tenant",
            addStation: "Add New Station",
            scanQR: "Scan QR Code",
            scanInstruction: "Point your camera at the QR code on the charger"
        },
        form: {
            companyName: "Company Name",
            country: "Country",
            contactEmail: "Contact Email",
            plan: "Subscription Plan",
            submit: "Submit",
            stationName: "Station Name",
            address: "Address",
            city: "City",
            coordinates: "GPS Coordinates",
            chargerCount: "Number of Chargers"
        },
        filter: {
            allStations: "All Stations",
            allStatus: "All Status"
        },
        status: {
            available: "Available",
            charging: "Charging",
            offline: "Offline"
        }
    },
    zh: {
        brand: "充电站管理平台",
        nav: {
            home: "首页",
            admin: "管理后台",
            company: "企业门户",
            userApp: "用户应用",
            about: "关于"
        },
        hero: {
            title: "全球电动汽车充电管理平台",
            subtitle: "为全球充电网络提供全面的SaaS解决方案",
            demo: "申请演示",
            features: "查看功能"
        },
        stats: {
            stations: "充电站",
            countries: "国家",
            users: "活跃用户"
        },
        features: {
            title: "平台功能",
            global: "全球覆盖",
            globalDesc: "支持多币种、多语言和多种支付方式",
            analytics: "实时分析",
            analyticsDesc: "全面了解您的充电网络性能",
            mobile: "移动优先",
            mobileDesc: "iOS和Android原生应用，无缝用户体验",
            ocpp: "OCPP兼容",
            ocppDesc: "支持OCPP 1.6J和2.0.1协议"
        },
        admin: {
            title: "平台管理后台",
            dashboard: "管理仪表板",
            overview: "概览",
            tenants: "租户",
            monitoring: "监控",
            billing: "账单",
            settings: "设置",
            platformOverview: "平台概览",
            totalTenants: "总租户数",
            totalStations: "总充电站数",
            totalUsers: "总用户数",
            activeCharging: "正在充电",
            platformGrowth: "平台增长",
            tenantManagement: "租户管理",
            addTenant: "添加租户",
            systemMonitoring: "系统监控",
            systemHealth: "系统健康",
            operational: "所有系统正常运行",
            apiStatus: "API状态",
            responseTime: "响应时间",
            uptime: "正常运行时间"
        },
        company: {
            title: "企业门户",
            dashboard: "企业仪表板",
            overview: "概览",
            stations: "充电站",
            chargers: "充电桩",
            sessions: "充电会话",
            pricing: "定价",
            analytics: "分析",
            networkOverview: "网络概览",
            totalStations: "总充电站",
            totalChargers: "总充电桩",
            activeCharging: "正在充电",
            monthlyRevenue: "月收入",
            stationMap: "充电站地图",
            stationManagement: "充电站管理",
            addStation: "添加充电站",
            chargerManagement: "充电桩管理",
            chargingSessions: "充电会话",
            activeSessions: "活跃会话",
            recentSessions: "最近会话"
        },
        user: {
            appTitle: "充电助手",
            searchStations: "搜索充电站...",
            viewList: "查看列表",
            chargingInProgress: "充电进行中",
            duration: "时长",
            energy: "电量",
            cost: "费用",
            stopCharging: "停止充电",
            myVehicles: "我的车辆",
            paymentMethods: "支付方式",
            chargingHistory: "充电历史",
            favorites: "收藏站点",
            settings: "设置",
            map: "地图",
            scan: "扫码",
            activity: "活动",
            wallet: "钱包"
        },
        login: {
            email: "电子邮件",
            password: "密码",
            companyId: "公司ID",
            remember: "记住我",
            submit: "登录",
            forgot: "忘记密码？"
        },
        logout: "退出",
        table: {
            id: "ID",
            companyName: "公司名称",
            country: "国家",
            stations: "充电站",
            users: "用户",
            status: "状态",
            actions: "操作",
            chargerId: "充电桩ID",
            station: "充电站",
            type: "类型",
            power: "功率 (kW)",
            currentUser: "当前用户"
        },
        modal: {
            addTenant: "添加新租户",
            addStation: "添加新充电站",
            scanQR: "扫描二维码",
            scanInstruction: "将相机对准充电桩上的二维码"
        },
        form: {
            companyName: "公司名称",
            country: "国家",
            contactEmail: "联系邮箱",
            plan: "订阅计划",
            submit: "提交",
            stationName: "充电站名称",
            address: "地址",
            city: "城市",
            coordinates: "GPS坐标",
            chargerCount: "充电桩数量"
        },
        filter: {
            allStations: "所有充电站",
            allStatus: "所有状态"
        },
        status: {
            available: "可用",
            charging: "充电中",
            offline: "离线"
        }
    },
    es: {
        brand: "EV Charge Hub",
        nav: {
            home: "Inicio",
            admin: "Portal de Admin",
            company: "Portal Empresarial",
            userApp: "App de Usuario",
            about: "Acerca de"
        },
        hero: {
            title: "Plataforma Global de Gestión de Carga EV",
            subtitle: "Potenciando redes de carga en todo el mundo con nuestra solución SaaS integral",
            demo: "Solicitar Demo",
            features: "Ver Características"
        },
        stats: {
            stations: "Estaciones de Carga",
            countries: "Países",
            users: "Usuarios Activos"
        },
        features: {
            title: "Características de la Plataforma",
            global: "Cobertura Global",
            globalDesc: "Soporte para múltiples monedas, idiomas y métodos de pago",
            analytics: "Análisis en Tiempo Real",
            analyticsDesc: "Información completa sobre el rendimiento de su red de carga",
            mobile: "Móvil Primero",
            mobileDesc: "Aplicaciones nativas para iOS y Android con experiencia de usuario perfecta",
            ocpp: "Compatible con OCPP",
            ocppDesc: "Soporte para protocolos OCPP 1.6J y 2.0.1"
        },
        login: {
            email: "Correo electrónico",
            password: "Contraseña",
            companyId: "ID de Empresa",
            remember: "Recordarme",
            submit: "Iniciar Sesión",
            forgot: "¿Olvidó su contraseña?"
        },
        logout: "Cerrar Sesión"
    },
    fr: {
        brand: "EV Charge Hub",
        nav: {
            home: "Accueil",
            admin: "Portail Admin",
            company: "Portail Entreprise",
            userApp: "App Utilisateur",
            about: "À propos"
        },
        hero: {
            title: "Plateforme Mondiale de Gestion de Recharge EV",
            subtitle: "Propulser les réseaux de recharge dans le monde entier avec notre solution SaaS complète",
            demo: "Demander une Démo",
            features: "Voir les Fonctionnalités"
        },
        stats: {
            stations: "Stations de Recharge",
            countries: "Pays",
            users: "Utilisateurs Actifs"
        },
        features: {
            title: "Fonctionnalités de la Plateforme",
            global: "Couverture Mondiale",
            globalDesc: "Support pour plusieurs devises, langues et méthodes de paiement",
            analytics: "Analyses en Temps Réel",
            analyticsDesc: "Aperçus complets des performances de votre réseau de recharge",
            mobile: "Mobile First",
            mobileDesc: "Applications natives pour iOS et Android avec une expérience utilisateur fluide",
            ocpp: "Compatible OCPP",
            ocppDesc: "Support des protocoles OCPP 1.6J et 2.0.1"
        },
        login: {
            email: "Email",
            password: "Mot de passe",
            companyId: "ID Entreprise",
            remember: "Se souvenir de moi",
            submit: "Se connecter",
            forgot: "Mot de passe oublié?"
        },
        logout: "Déconnexion"
    },
    de: {
        brand: "EV Charge Hub",
        nav: {
            home: "Startseite",
            admin: "Admin-Portal",
            company: "Unternehmensportal",
            userApp: "Benutzer-App",
            about: "Über uns"
        },
        hero: {
            title: "Globale EV-Lademanagement-Plattform",
            subtitle: "Befähigung von Ladenetzwerken weltweit mit unserer umfassenden SaaS-Lösung",
            demo: "Demo anfordern",
            features: "Funktionen anzeigen"
        },
        stats: {
            stations: "Ladestationen",
            countries: "Länder",
            users: "Aktive Benutzer"
        },
        features: {
            title: "Plattform-Funktionen",
            global: "Globale Abdeckung",
            globalDesc: "Unterstützung für mehrere Währungen, Sprachen und Zahlungsmethoden",
            analytics: "Echtzeit-Analysen",
            analyticsDesc: "Umfassende Einblicke in die Leistung Ihres Ladenetzwerks",
            mobile: "Mobile First",
            mobileDesc: "Native Apps für iOS und Android mit nahtloser Benutzererfahrung",
            ocpp: "OCPP-kompatibel",
            ocppDesc: "Unterstützung für OCPP 1.6J und 2.0.1 Protokolle"
        },
        login: {
            email: "E-Mail",
            password: "Passwort",
            companyId: "Unternehmens-ID",
            remember: "Angemeldet bleiben",
            submit: "Anmelden",
            forgot: "Passwort vergessen?"
        },
        logout: "Abmelden"
    },
    ja: {
        brand: "EV充電ハブ",
        nav: {
            home: "ホーム",
            admin: "管理ポータル",
            company: "企業ポータル",
            userApp: "ユーザーアプリ",
            about: "について"
        },
        hero: {
            title: "グローバルEV充電管理プラットフォーム",
            subtitle: "包括的なSaaSソリューションで世界中の充電ネットワークを強化",
            demo: "デモをリクエスト",
            features: "機能を見る"
        },
        stats: {
            stations: "充電ステーション",
            countries: "国",
            users: "アクティブユーザー"
        },
        features: {
            title: "プラットフォーム機能",
            global: "グローバルカバレッジ",
            globalDesc: "複数の通貨、言語、支払い方法をサポート",
            analytics: "リアルタイム分析",
            analyticsDesc: "充電ネットワークのパフォーマンスに関する包括的な洞察",
            mobile: "モバイルファースト",
            mobileDesc: "iOSとAndroid向けのネイティブアプリでシームレスなユーザー体験",
            ocpp: "OCPP対応",
            ocppDesc: "OCPP 1.6Jおよび2.0.1プロトコルをサポート"
        },
        login: {
            email: "メールアドレス",
            password: "パスワード",
            companyId: "企業ID",
            remember: "ログイン状態を保持",
            submit: "ログイン",
            forgot: "パスワードをお忘れですか？"
        },
        logout: "ログアウト"
    },
    ko: {
        brand: "EV 충전 허브",
        nav: {
            home: "홈",
            admin: "관리자 포털",
            company: "기업 포털",
            userApp: "사용자 앱",
            about: "소개"
        },
        hero: {
            title: "글로벌 EV 충전 관리 플랫폼",
            subtitle: "포괄적인 SaaS 솔루션으로 전 세계 충전 네트워크 강화",
            demo: "데모 요청",
            features: "기능 보기"
        },
        stats: {
            stations: "충전소",
            countries: "국가",
            users: "활성 사용자"
        },
        features: {
            title: "플랫폼 기능",
            global: "글로벌 커버리지",
            globalDesc: "다중 통화, 언어 및 결제 방법 지원",
            analytics: "실시간 분석",
            analyticsDesc: "충전 네트워크 성능에 대한 포괄적인 통찰력",
            mobile: "모바일 우선",
            mobileDesc: "원활한 사용자 경험을 제공하는 iOS 및 Android 네이티브 앱",
            ocpp: "OCPP 호환",
            ocppDesc: "OCPP 1.6J 및 2.0.1 프로토콜 지원"
        },
        login: {
            email: "이메일",
            password: "비밀번호",
            companyId: "회사 ID",
            remember: "로그인 상태 유지",
            submit: "로그인",
            forgot: "비밀번호를 잊으셨나요?"
        },
        logout: "로그아웃"
    },
    ar: {
        brand: "محطة الشحن الكهربائي",
        nav: {
            home: "الرئيسية",
            admin: "بوابة المشرف",
            company: "بوابة الشركة",
            userApp: "تطبيق المستخدم",
            about: "حول"
        },
        hero: {
            title: "منصة إدارة شحن السيارات الكهربائية العالمية",
            subtitle: "تمكين شبكات الشحن في جميع أنحاء العالم من خلال حل SaaS الشامل",
            demo: "طلب عرض توضيحي",
            features: "عرض الميزات"
        },
        stats: {
            stations: "محطات الشحن",
            countries: "البلدان",
            users: "المستخدمون النشطون"
        },
        features: {
            title: "ميزات المنصة",
            global: "تغطية عالمية",
            globalDesc: "دعم العملات واللغات وطرق الدفع المتعددة",
            analytics: "التحليلات في الوقت الفعلي",
            analyticsDesc: "رؤى شاملة حول أداء شبكة الشحن الخاصة بك",
            mobile: "الجوال أولاً",
            mobileDesc: "تطبيقات أصلية لنظامي iOS و Android مع تجربة مستخدم سلسة",
            ocpp: "متوافق مع OCPP",
            ocppDesc: "دعم بروتوكولات OCPP 1.6J و 2.0.1"
        },
        login: {
            email: "البريد الإلكتروني",
            password: "كلمة المرور",
            companyId: "معرف الشركة",
            remember: "تذكرني",
            submit: "تسجيل الدخول",
            forgot: "هل نسيت كلمة المرور؟"
        },
        logout: "تسجيل الخروج"
    }
};

let currentLanguage = localStorage.getItem('language') || 'en';

function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    
    // Set RTL for Arabic
    if (lang === 'ar') {
        document.documentElement.setAttribute('dir', 'rtl');
    } else {
        document.documentElement.setAttribute('dir', 'ltr');
    }
    
    updatePageTranslations();
}

function updatePageTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = getNestedTranslation(translations[currentLanguage], key);
        if (translation) {
            element.textContent = translation;
        }
    });
    
    // Update placeholders
    const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = getNestedTranslation(translations[currentLanguage], key);
        if (translation) {
            element.placeholder = translation;
        }
    });
}

function getNestedTranslation(obj, key) {
    const keys = key.split('.');
    let result = obj;
    
    for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
            result = result[k];
        } else {
            return null;
        }
    }
    
    return result;
}

// Initialize i18n system
function initI18n() {
    console.log('Initializing i18n system...');
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    changeLanguage(currentLanguage);
}

// Make i18n globally available
window.i18n = {
    changeLanguage: changeLanguage,
    currentLanguage: currentLanguage,
    translations: translations
};

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
    const languageSelect = document.getElementById('languageSelect');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    changeLanguage(currentLanguage);
});
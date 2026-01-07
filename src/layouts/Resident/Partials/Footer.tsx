import { Layout, Typography } from 'antd';
import { Facebook, Instagram, Globe } from 'lucide-react';

const { Footer } = Layout;
const { Text, Link } = Typography;

export const HomeFooter = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Footer className="bg-white !border-t !border-gray-100 !px-6 !py-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                    <div className="flex items-center gap-2.5">
                        <img src="/icon.png" alt="Logo" className="w-8 h-8 object-contain" />
                        <span className="font-bold text-gray-700 text-base tracking-tight">
                            Desa Cibiru Wetan
                        </span>
                    </div>
                    <span className="hidden md:block w-px h-5 bg-gray-200"></span>
                    <Text className="text-gray-400 text-xs">
                        © {currentYear} Pemerintah Desa. All rights reserved.
                    </Text>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex gap-6">
                        <Link href="#" className="text-gray-500 text-sm font-medium hover:text-[#70B748] transition-colors">
                            Bantuan
                        </Link>
                        <Link href="#" className="text-gray-500 text-sm font-medium hover:text-[#70B748] transition-colors">
                            Privasi
                        </Link>
                        <Link href="#" className="text-gray-500 text-sm font-medium hover:text-[#70B748] transition-colors">
                            Kontak
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <a href="#" className="text-gray-400 hover:text-[#70B748] transition-colors">
                            <Globe size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#70B748] transition-colors">
                            <Instagram size={18} />
                        </a>
                        <a href="#" className="text-gray-400 hover:text-[#70B748] transition-colors">
                            <Facebook size={18} />
                        </a>
                    </div>
                </div>

            </div>
        </Footer>
    );
};
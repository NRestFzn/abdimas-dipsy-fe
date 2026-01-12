import { Layout, Tooltip, Typography } from 'antd';
import { YoutubeFilled, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';

const { Footer } = Layout;
const { Text } = Typography;

export const HomeFooter = () => {
    const currentYear = new Date().getFullYear();

    const footerData = {
        youtube: "https://www.youtube.com/channel/UCZkoecQJPaqrZderyHehgUw",
        email: "cibiruwetan2006@gmail.com",
        address: "Jl. Cibangkonol No. 28 Cileunyi, Kecamatan Cileunyi, Kabupaten Bandung - Jawa Barat 40625",
    };

    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(footerData.address)}`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${footerData.email}`;

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
                    <Text className="text-gray-400 text-xs text-center md:text-left">
                        © {currentYear} Pemerintah Desa. All rights reserved.
                    </Text>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">

                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
                        {footerData.address && (
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="group flex items-center gap-2 text-gray-500 hover:text-[#70B748] transition-colors"
                            >
                                <EnvironmentOutlined className="!text-gray-400 group-hover:text-[#70B748] text-lg" />
                                <span className="text-sm font-medium max-w-[200px] md:max-w-[300px] truncate">
                                    <Tooltip title={footerData.address} placement="top">
                                        Lokasi Desa
                                    </Tooltip>
                                </span>
                            </a>
                        )}

                        {footerData.email && (
                            <a
                                href={gmailUrl}
                                target='_blank'
                                rel='noreferrer'
                                className="group flex items-center gap-2 text-gray-500 hover:text-[#70B748] transition-colors"
                            >
                                <MailOutlined className="!text-gray-400 group-hover:text-[#70B748] text-lg" />
                                <span className="text-sm font-medium">Hubungi Kami</span>
                            </a>
                        )}
                    </div>

                    <div className="flex items-center gap-4 pl-0 md:pl-4 md:border-l md:border-gray-200">
                        {footerData.youtube && (
                            <Tooltip title="Channel YouTube Resmi">
                                <a
                                    href={footerData.youtube}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="transition-transform hover:scale-110 flex items-center"
                                >
                                    <div className="bg-red-50 p-2 rounded-full hover:bg-red-100 transition-colors flex items-center justify-center">
                                        <YoutubeFilled
                                            style={{ color: '#FF0000', fontSize: '20px' }}
                                        />
                                    </div>
                                </a>
                            </Tooltip>
                        )}
                    </div>
                </div>

            </div>
        </Footer>
    );
};
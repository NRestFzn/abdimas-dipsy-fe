import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ResultPieChartProps {
  yaCount: number;
  tidakCount: number;
}

export default function ResultPieChart({ yaCount, tidakCount }: ResultPieChartProps) {
  const data = [
    { name: "Ya", value: yaCount, color: "#EF4444" },
    { name: "Tidak", value: tidakCount, color: "#70B748" },
  ];

  const total = yaCount + tidakCount;

  const renderLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="flex justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const { name, value, color } = entry.payload;

          return (
            (
              <div
                key={`item-${index}`}
                className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-2 rounded-xl shadow-sm"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                    {name}
                  </span>
                  <span className="text-lg font-bold text-gray-800">
                    {value}
                    <span className="text-xs text-gray-400 font-normal ml-1">
                      ({total > 0 ? Math.round((value / total) * 100) : 0}%)
                    </span>
                  </span>
                </div>
              </div>
            )
          )
        })}
      </div>
    );
  };

  return (
    <div className="w-full h-[350px] flex flex-col justify-center items-center relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={110}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                style={{ outline: 'none' }}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} Jawaban`, 'Jumlah']}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend content={renderLegend} />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute top-[42%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <span className="block text-4xl font-bold text-gray-800">{total}</span>
        <span className="text-sm text-gray-400 font-medium">Pertanyaan</span>
      </div>
    </div>
  );
}
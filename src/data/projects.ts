import type { Project } from './project.types';

// Placeholder content until Sanity is connected. Shape mirrors the planned project document.
export const projects: Project[] = [
	{
		id: 'ventilated-brake-rotor',
		title: 'Ventilated brake rotor',
		system: 'Brakes',
		discipline: 'Formula Student team. Thermal simulation in ANSYS, design for manufacture',
		year: '2025',
		figures: [
			{ variant: 'rotor', caption: 'Rotor, front view. Ø 340 mm' },
			{ variant: 'curve', caption: 'Disc temperature against time over a braking cycle' },
		],
		paragraphs: [
			'The team needed a front rotor that stayed within its temperature limit through a full endurance run without adding unsprung mass.',
			'I started from the heat load. Using lap data and the car mass, I estimated the energy each rotor absorbs per braking zone and used that as the boundary condition for the simulation.',
			'The vane layout was the main variable. I compared straight and curved vanes in ANSYS, looking at peak disc temperature and how evenly the heat spread across the swept face.',
			'The best thermal result needed a vane shape the workshop could not machine from the stock the team could buy. I went back to the model and changed the vane radius until it could be cut in two setups.',
			'The finished design met the temperature target in simulation with a lower mass than the previous rotor.',
		],
	},
	{
		id: 'turbo-response-mapping',
		title: 'Turbo response mapping',
		system: 'Powertrain',
		discipline: 'Final-year project. Engine calibration and dyno testing',
		year: '2024',
		figures: [
			{ variant: 'curve', caption: 'Torque against rpm, peak marked' },
			{ variant: 'gear', caption: 'Compressor drive, schematic' },
		],
		paragraphs: [
			'This project asked how quickly a small turbocharged engine reaches useful torque, and what calibration changes improve it.',
			'I ran the engine on a dyno across a grid of speed and load points, logging boost pressure, torque and air flow at each.',
			'The measurements showed a delay between throttle input and boost that varied with engine speed. I mapped that delay so the effect of each calibration change could be compared on the same basis.',
			'Changing the wastegate control and ignition timing shifted the torque curve earlier in the rev range. I repeated each test several times to separate real changes from run-to-run scatter.',
		],
	},
	{
		id: 'lightweight-piston-and-rod',
		title: 'Lightweight piston and rod',
		system: 'Engine',
		discipline: 'Coursework. Finite element analysis and materials selection',
		year: '2023',
		figures: [{ variant: 'section', caption: 'Piston and rod, section view' }],
		paragraphs: [
			'The brief was to reduce the reciprocating mass of a piston and connecting rod without losing fatigue life.',
			'I compared candidate materials on strength-to-weight and cost, then modelled the peak gas and inertia loads in finite element analysis.',
			'Material was removed where the stress was low and kept around the pin boss and rod big end, where the model showed the highest stress.',
		],
	},
	{
		id: 'close-ratio-gearset',
		title: 'Close-ratio gearset',
		system: 'Transmission',
		discipline: 'Coursework. Gear design and fatigue calculations',
		year: '2022',
		figures: [
			{ variant: 'gear', caption: 'Spur gear, module 2.5, 40 teeth' },
			{ variant: 'section', caption: 'Gear and shaft, section view' },
		],
		paragraphs: [
			'This coursework project designed a set of close ratios for a six-speed gearbox, keeping the engine in its power band between shifts.',
			'I chose the ratios first, then sized each gear pair for bending and contact fatigue against the engine torque curve.',
		],
	},
];

export const getProject = (id: string): Project | undefined => projects.find((p) => p.id === id);

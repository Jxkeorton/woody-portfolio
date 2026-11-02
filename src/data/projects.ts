import type { Project } from './project.types';

// Placeholder content until Sanity is connected. Shape mirrors the planned project document.
export const projects: Project[] = [
	{
		id: 'practical-vehicle-design',
		title: 'Practical vehicle design',
		system: 'Steering',
		discipline: 'Group project, team of six. Steering design, manufacture and testing',
		year: '2025',
		figures: [
			{ variant: 'gear', caption: 'Gear train, schematic' },
			{ variant: 'section', caption: 'Drivetrain, section view' },
		],
		paragraphs: [
			'In a team of six, we had to design, test and build a small, self-driven mechanical car to complete a slalom and ramp course, with limited resources. The project was marked on the quality of the technical report, the design considerations and our reflection.',
			'My role was the steering system. I calculated the steering geometry and evaluated the manoeuvrability the slalom required, so the design came from those requirements.',
			'I also helped manufacture and test the car, using laser-cut and 3D-printed components, and soldered the circuit for the motors and batteries.',
			'In testing, the car ran inconsistently and stalled. High friction in the wooden laser-cut gears and a gear modulus that was too small were the main causes.',
			'The project showed me how much gear design, material selection and friction management matter in a mechanical system.',
			'The project achieved 70%, which reflected the quality of our written analysis and our discussion of the challenges. Working within the constraints made me look for alternative solutions, and showed me how calculations and material choices shape the design.',
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

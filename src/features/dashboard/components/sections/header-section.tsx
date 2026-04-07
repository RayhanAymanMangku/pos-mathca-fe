
interface HeaderSectionProps {
    title: string;
    description: string;
    name?: string;
}

const HeaderSection = ({ title, description, name }: HeaderSectionProps) => {

    return (
        <div className="flex flex-col gap-1 px-1">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 leading-none">
                {title} <span className="text-green-700 font-extrabold">{name}</span>
            </h1>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest mt-2">
                {description}
            </p>
        </div>
    )
}

export default HeaderSection    
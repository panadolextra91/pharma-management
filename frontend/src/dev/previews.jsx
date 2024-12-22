import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import AdminDashboard from "../components/AdminDashboard";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/AdminDashboard">
                <AdminDashboard/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews
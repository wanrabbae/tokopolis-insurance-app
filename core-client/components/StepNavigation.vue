<template>
    <ul class="step-navigation">
        <li 
            v-for="(step, id) in steps" 
            :key="id"
            class="px-2" 
            :class="{ 
                'current': id === currentStep,
                'active': id <= currentStep
            }"
            :style="{
                'width': 100 / steps.length + '%'
            }"
        >
            <div class="step-icon pointer" @click="navClickHandler(id)">
                <component :is="step.icon"></component>
            </div>
            <div class="step-caption mb-1">
                {{ step.caption }}
            </div>
            <!-- <div v-if="id <= currentStep" class="step-date-complete">
                {{ step.dateComplete }}
            </div> -->
        </li>
    </ul>
</template>

<script>
import ReportIcon from '../assets/svg/report.svg'
import SurveyIcon from '../assets/svg/survey.svg'
import ApprovedIcon from '../assets/svg/approved.svg'
import VehicleUnderRepairIcon from '../assets/svg/vehicle-under-repair.svg'
import VehicleReadyIcon from '../assets/svg/vehicle-ready.svg'
import CheckedIcon from '../assets/svg/checked.svg'

export default {
    name: 'StepNavigation',
    components: {
        ReportIcon,
        SurveyIcon,
        ApprovedIcon,
        VehicleUnderRepairIcon,
        VehicleReadyIcon,
        CheckedIcon
    },
    props: {
        currentStep: {
            type: Number,
            default: 0
        },
        steps: {
            type: Array,
            default() {
                return []
            }
        },
    },
    methods: {
        navClickHandler(id) {
            // this.$emit('nav-click', id);
        }
    }
}
</script>

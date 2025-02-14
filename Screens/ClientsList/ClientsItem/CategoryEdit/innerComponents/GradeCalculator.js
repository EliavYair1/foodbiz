import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import colors from "../../../../../styles/colors";
import ReportGrade from "./ReportGrade";

const GradeCalculator = ({
  categoryType,
  categoryNames,
  parsedCategoriesDataFromReport,
  currentReportItemsForGrade,
  passedDownCategoryId,
  CategoriesItems,
  currentReport,
  onCategoryGradeChange,
  onMajorCategoryGradeChange,
  onReportGradeChange,
  majorCategory,
}) => {
  const [categoryGrade, setCategoryGrade] = useState(0);
  const [majorCategoryGrade, setMajorCategoryGrade] = useState(0);
  const [reportGrade, setReportGrade] = useState(0);

  // * Major category grade calculation
  const calculateMajorCategoryGrade = () => {
    let currentSubcategories = categoryNames[categoryType];

    // * counting the amount of the currentSubcategories for calculation.
    let numberOfCurrentSubcategories = currentSubcategories.length;

    if (currentSubcategories) {
      // * matching the ids of the current categories to the ids of the categories report data.
      let currentPickedCategoriesElementsId =
        parsedCategoriesDataFromReport.filter((element) =>
          currentSubcategories
            .map((item) => item.id)
            .includes(parseInt(element.id, 10))
        );
      let totalGrade = 0;
      // * extracting the grades of the currentPickedCategoriesElementsId and sum the amount of the total grades
      currentPickedCategoriesElementsId.forEach((element) => {
        const grade = parseInt(
          passedDownCategoryId == element.id ? categoryGrade : element.grade,
          10
        );
        totalGrade += grade;
      });

      // * calculating the avg of the totalGrade devided by numberOfCurrentSubcategories
      let avgValOfCurrentSubcategories = Math.round(
        totalGrade / numberOfCurrentSubcategories
      );
      setMajorCategoryGrade(avgValOfCurrentSubcategories);
    }
  };
  // * category grade calculation
  const calculateCategoryGrade = () => {
    let itemsTotal = 0;
    let itemsTotal1 = 0;
    let itemsTotal2 = 0;
    let itemsTotal3 = 0;
    for (const item of currentReportItemsForGrade) {
      if (item.noRelevant == 1 || item.noCalculate == 1) {
        continue;
      }
      if (item.categoryReset == 1) {
        setCategoryGrade(0);
        return;
      }
      let categoryItem = CategoriesItems.find((el) => el.id == item.id);
      if (item.grade == 0 && categoryItem?.critical == 1) {
        setCategoryGrade(0);
        return;
      }
      itemsTotal++;
      if (item.grade == 1) {
        itemsTotal1++;
      } else if (item.grade == 2) {
        itemsTotal2++;
      } else if (item.grade == 3) {
        itemsTotal3++;
      }
    }
    if (itemsTotal == 0) {
      setCategoryGrade(100);
    } else {
      setCategoryGrade(
        parseInt(
          ((itemsTotal1 + itemsTotal2 * 2 + itemsTotal3 * 3) /
            (itemsTotal * 3)) *
            100
        )
      );

      // console.log(itemsTotal, itemsTotal1, itemsTotal2, itemsTotal3);
    }
  };

  // * calculating the report Grade
  const calculateReportGrade = (value) => {
    let haveSafety = categoryNames[1].length > 0;
    let haveCulinary = categoryNames[2].length > 0;
    let haveNutrition = categoryNames[3].length > 0;
    let safetyGrade =
      categoryType == 1 ? value : currentReport.getData("safetyGrade");
    let culinaryGrade =
      categoryType == 2 ? value : currentReport.getData("culinaryGrade");
    let nutritionGrade =
      categoryType == 3 ? value : currentReport.getData("nutritionGrade");
    let reportGradeCalc = 0;
    if (haveSafety && !haveCulinary && !haveNutrition) {
      reportGradeCalc = safetyGrade;
    } else if (!haveSafety && haveCulinary && !haveNutrition) {
      reportGradeCalc = culinaryGrade;
    } else if (!haveSafety && !haveCulinary && haveNutrition) {
      reportGradeCalc = nutritionGrade;
    } else if (haveSafety && haveCulinary && !haveNutrition) {
      reportGradeCalc = safetyGrade * 0.5 + culinaryGrade * 0.5;
    } else if (haveSafety && !haveCulinary && haveNutrition) {
      reportGradeCalc = safetyGrade * 0.9 + nutritionGrade * 0.1;
    } else if (!haveSafety && haveCulinary && haveNutrition) {
      reportGradeCalc = culinaryGrade * 0.9 + nutritionGrade * 0.1;
    } else {
      reportGradeCalc =
        safetyGrade * 0.5 + culinaryGrade * 0.4 + nutritionGrade * 0.1;
    }
    setReportGrade(Math.round(reportGradeCalc));
  };

  useEffect(() => {
    calculateCategoryGrade();
  }, [currentReportItemsForGrade]);

  useEffect(() => {
    calculateMajorCategoryGrade();
    onCategoryGradeChange(categoryGrade);
    onMajorCategoryGradeChange(majorCategoryGrade);
    onReportGradeChange(reportGrade);
  }, [categoryGrade, majorCategoryGrade, reportGrade, categoryType]);

  useEffect(() => {
    calculateReportGrade(majorCategoryGrade);
  }, [majorCategoryGrade]);

  // * determain the color of the gradewrapper based on the grade value
  const gradeBackgroundColor = (grade) => {
    if (grade >= 90) {
      return colors.toggleColor1;
    } else if (grade < 90 && grade >= 85) {
      return colors.green;
    } else if (grade <= 84 && grade >= 79) {
      return colors.orange;
    } else if (grade < 79 && grade >= 70) {
      return colors.pink;
    } else {
      return colors.redish;
    }
  };

  return (
    <View style={styles.gradesContainer}>
      <ReportGrade
        reportGradeBoxColor={gradeBackgroundColor(categoryGrade)}
        reportGradeNumber={categoryGrade}
        reportGradeText={"ציון קטגוריה"}
      />
      <ReportGrade
        reportGradeBoxColor={gradeBackgroundColor(majorCategoryGrade)}
        reportGradeNumber={majorCategoryGrade}
        reportGradeText={`ציון ${majorCategory}`}
      />
      <ReportGrade
        reportGradeBoxColor={gradeBackgroundColor(reportGrade)}
        reportGradeNumber={reportGrade}
        reportGradeText={"ציון לדוח"}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  gradesContainer: {
    flexDirection: "row",
    gap: 16,
    backgroundColor: colors.accordionOpen,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
export default GradeCalculator;

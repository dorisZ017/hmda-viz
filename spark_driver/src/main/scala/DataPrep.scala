import org.apache.spark.sql.SparkSession
import org.apache.spark.sql.functions._

import scala.util.{Success, Try}

object DataPrep {

  // https://ffiec.cfpb.gov/documentation/publications/loan-level-datasets/lar-data-fields

  private val loanPurpose = udf[String, Int] {
    case 1 => "Home purchase"
    case 2 => "Home improvement"
    case 31 => "Refinancing"
    case 32 => "Cash-out refinancing"
    case 4 => "Other purpose"
    case 5 => "Not applicable"
    case _ => "NA"
  }

  private val loanType = udf[String, Int] {
    case 1 => "Conventional"
    case 2 => "Federal Housing Administration insured"
    case 3 => "Veterans Affairs guaranteed"
    case 4 => "USDA Rural Housing Service or Farm Service Agency guaranteed"
  }

  private val actionTaken = udf[String, Int] {
    case 1 => "Loan originated"
    case 2 => "Application approved but not accepted"
    case 3 => "Application denied"
    case 4 => "Application withdrawn by applicant"
    case 5 => "File closed for incompleteness"
    case 6 => "Purchased loan"
    case 7 => "Preapproval request denied"
    case 8 => "Preapproval request approved but not accepted"
  }


  private val occupancyType = udf[String, Int] {
    case 1 => "Principal residence"
    case 2 => "Second residence"
    case 3 => "Investment property"
    case _ => "NA"
  }

  private val tryToFloat = udf[Option[Float], String] { input =>
    Try(input.toFloat) match {
      case Success(value) => Some(value)
      case _ => None
    }
  }

  private val approved = udf[Boolean, Int] {
    case 1 => true
    case 2 => true
    case _ => false
  }

  private val ageEst = udf[Option[Int], String] {
    case "<25" => Some(20)
    case "25-34" => Some(30)
    case "35-44" => Some(40)
    case "45-54" => Some(50)
    case "55-64" => Some(60)
    case "65-74" => Some(70)
    case ">74" => Some(80)
    case _ => None
  }

  private val ratioEst = udf[Option[Int], String] {
    case "30%-<36%" => Some(33)
    case "20%-<30%" => Some(25)
    case "50%-60%" => Some(55)
    case ">60%" => Some(80)
    case "<20%" => Some(10)
    case x => try (Option(x.toInt)) catch {
      case _ => None
    }
  }


  private val strToNumCols = Seq("loan_to_value_ratio", "interest_rate", "rate_spread",
    "total_loan_costs", "total_points_and_fees", "origination_charges", "discount_points", "lender_credits",
    "loan_term", "intro_rate_period", "property_value", "income")

  private val decoders = Map (
    "loan_purpose" -> loanPurpose,
    "loan_type" -> loanType,
    "action_taken" -> actionTaken,
    "occupancy_type" -> occupancyType
  )


  def main(args: Array[String]): Unit = {
    val inputPath = args(0)
    val spark = SparkSession.builder.appName("DataPrep").enableHiveSupport().getOrCreate()
    val data = spark.read.option("header", value = true).option("inferSchema", value = true).csv(inputPath)
    val renamed = strToNumCols.foldLeft(data) {
      case (d, name) => d.withColumnRenamed(name, s"${name}_str")
    }
    val estimated = renamed.withColumns(Map(
      "is_approved" -> approved(col("action_taken")),
      "applicant_age_est" -> ageEst(col("applicant_age")),
      "debt_to_income_ratio_est" -> ratioEst(col("debt_to_income_ratio"))
    ))
    val cleaned = strToNumCols.foldLeft(estimated) {
      case (d, name) => d.withColumn(name, tryToFloat(col(s"${name}_str"))).drop(s"${name}_str")
    }

    val decoded = decoders.foldLeft(cleaned) {
      case (d, (name, f)) => d
        .withColumnRenamed(name, s"${name}_encoded")
        .withColumn(name, f(col(s"${name}_encoded")))
        .drop(s"${name}_encoded")
    }

    decoded.write.format("parquet").mode("overwrite").saveAsTable("t1")
  }
}

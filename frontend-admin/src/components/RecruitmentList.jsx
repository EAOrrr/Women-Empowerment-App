import { useGetRecruitmentsQuery } from "../services/recruitmentsApi"
import Loading from "./Loading"
import RecruitmentCard from "./RecruitmentCard"

const RecruitmentList = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error
  } = useGetRecruitmentsQuery()

  if (isLoading || isFetching) {
    return <Loading message={'加载招聘信息中'} />
  }

  if (isError) {
    switch (error.status) {
    case 404:
      return <> 404 Not Found </>
    case 500:
      return <> 500 服务器错误 </>
    default:
      return <> 未知错误</>
    }
  }

  console.log(data)
  const recruitments = data

  return (
    <div>
      {recruitments.map((recruitment) => 
      <RecruitmentCard key={recruitment.id} recruitment={recruitment} />)}
    </div>
  );
}

export default RecruitmentList;
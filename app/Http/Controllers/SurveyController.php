<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyQuestionResource;
use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Models\SurveyQuestion;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;





class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();
        // return Survey::where('user_id', $user->id)->paginate();
        return SurveyResource::collection(Survey::where('user_id', $user->id)->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSurveyRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSurveyRequest $request)
    {
        // $request->validted()
        // $result = Survey::create($request->validated());
        
        $data = $request->validated();

        //check image 
        if(isset($data['image'])){
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $survey = Survey::create($data);
        
        //create new question
        foreach($data['questions'] as $question)
        {
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);

        }

        //iamge url data:image/jpeg;base64, bla bla bla 
        return new SurveyResource($survey); //create new instance and passing the result 
    }

    private function createQuestion($data){


        // if data is contain data right here
        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }

        //enums use 8.1 laravel
        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => ['required' , Rule::in([
                Survey::TYPE_CHECKBOX,
                Survey::TYPE_RADIO,
                Survey::TYPE_SELECT,
                Survey::TYPE_TEXT,
                Survey::TYPE_TEXTAREA,
            ])],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'exists:App\Models\Survey,id'
        ]);

        return SurveyQuestion::create($validator->validated());

    }


    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function show(Survey $survey , Request $request)
    {
        $user = $request->user();
        // check statement here
        if($user->id !== $survey->user_id){
            return abort(403,'Unauthorized action');
        }

        return new SurveyResource($survey);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSurveyRequest  $request
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
        // $survey->update($request->validated());
        $data = $request->validated();

        if(isset($data['image'])){
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            // old image , delete it
            if($survey->image){
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }
        }

        $survey->update($data);

        //get id as plain array of existiong questions
        $existingIds = $survey->questions()->pluck('id')->toArray();
        //get ids as plain array of new questions
        $newIds = Arr::pluck($data['questions'] , 'id');
        //find questions to delete
        $toDelete = array_diff($existingIds, $newIds);
        //find questions to add
        $toAdd = array_diff($newIds,$existingIds);
        //delete questions by $toDelete array
        SurveyQuestion::destroy($toDelete);
        //create new questions 
        foreach($data['questions'] as $question)
        {
            if(in_array($question['id'], $toAdd))
            {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }
        //update existing questions
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach($survey->questions as $question){
            if(isset($questionMap[$question->id])){
                $this->updateQuestion($question , $questionMap[$question->id]);
            }
        }

        return new SurveyResource($survey);

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey, Request $request)
    {
        $user = $request->user();
        if($user->id !== $survey->user_id){
            return abort(403,'Unauthorized action');
        }

        $survey->delete();
          //  delete image 
        if($survey->image){
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }

        return response('',204);
        // The 204 (No Content) status code indicates that the server has successfully fulfilled the request and that there is no additional content to send in the response payload body.
    }


    private function saveImage($image)
    {
        //check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/',$image , $type)){

            //take out and encode the text without mime type
            $image = substr($image, strpos($image,',')+1);

            //get the file extension
            $type = strtolower($type[1]); // jpg, png , gif

            // check if file is an image 
            if(!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])){
                throw new \Exception('invalid image type');
            }

            $image = str_replace(' ','+',$image);
            $image = base64_decode($image);

            if($image === false)
            {
                throw new \Exception('base64_decode failed');
            }
        }
        else{
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random().'.'.$type;
        $absolutePath = public_path($dir);
        $relativePath = $dir.$file;

        // check file exist or not
        if(!File::exists($absolutePath)){
            File::makeDirectory($absolutePath,0755,true);
        }
        file_put_contents($relativePath,$image);

        return $relativePath;


    }


    private function updateQuestion(SurveyQuestion $question, $data){

        if(is_array($data['data'])){
            $data['data'] = json_encode($data['data']);
        }

        $validator = Validator::make($data , [
            'id' => 'exists:App\Models\SurveyQuestion,id',
            'question' => 'required|string',
            'type' => ['required', Rule::in([
                Survey::TYPE_TEXT,
                Survey::TYPE_TEXTAREA,
                Survey::TYPE_SELECT,
                Survey::TYPE_RADIO,
                Survey::TYPE_CHECKBOX,
            ])],
            'description' => 'nullable|string',
            'data' =>'present',
        ]);
        
        return $question->update($validator->validated());
        }
}

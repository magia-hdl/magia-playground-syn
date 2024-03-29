import {Context, APIGatewayProxyResult, APIGatewayEvent} from 'aws-lambda';
import * as netlistsvg from 'netlistsvg';

const defaultSkin = `
<svg  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  xmlns:s="https://github.com/nturley/netlistsvg"
  width="800" height="300">
  <s:properties>
    <s:layoutEngine
      org.eclipse.elk.layered.spacing.nodeNodeBetweenLayers="35"
      org.eclipse.elk.spacing.nodeNode= "35"
      org.eclipse.elk.layered.layering.strategy= "LONGEST_PATH"
    />
    <s:low_priority_alias val="$dff" />
  </s:properties>
<style>
svg {
  stroke:#000;
  fill:none;
}
text {
  fill:#000;
  stroke:none;
  font-size:10px;
  font-weight: bold;
  font-family: "Courier New", monospace;
}
.nodelabel {
  text-anchor: middle;
}
.inputPortLabel {
  text-anchor: end;
}
.splitjoinBody {
  fill:#000;
}
</style>
  <g s:type="mux" transform="translate(50, 50)" s:width="20" s:height="40">
    <s:alias val="$pmux"/>
    <s:alias val="$mux"/>
    <s:alias val="$_MUX_"/>

    <path d="M0,0 L20,10 L20,30 L0,40 Z" class="$cell_id"/>

    <g s:x="0" s:y="10" s:pid="A"/>
    <g s:x="0" s:y="30" s:pid="B"/>
    <g s:x="10" s:y="35" s:pid="S"/>
    <g s:x="20" s:y="20" s:pid="Y"/>
  </g>

  <!-- and -->
  <g s:type="and" transform="translate(150,50)" s:width="30" s:height="25">
    <s:alias val="$and"/>
    <s:alias val="$logic_and"/>
    <s:alias val="$_AND_"/>

    <path d="M0,0 L0,25 L15,25 A15 12.5 0 0 0 15,0 Z" class="$cell_id"/>

    <g s:x="0" s:y="5" s:pid="A"/>
    <g s:x="0" s:y="20" s:pid="B"/>
    <g s:x="30" s:y="12.5" s:pid="Y"/>
  </g>
  <g s:type="nand" transform="translate(150,100)" s:width="30" s:height="25">
    <s:alias val="$nand"/>
    <s:alias val="$logic_nand"/>
    <s:alias val="$_NAND_"/>
    <s:alias val="$_ANDNOT_"/>

    <path d="M0,0 L0,25 L15,25 A15 12.5 0 0 0 15,0 Z" class="$cell_id"/>
    <circle cx="34" cy="12.5" r="3" class="$cell_id"/>

    <g s:x="0" s:y="5" s:pid="A"/>
    <g s:x="0" s:y="20" s:pid="B"/>
    <g s:x="36" s:y="12.5" s:pid="Y"/>
  </g>

  <!-- or -->
  <g s:type="or" transform="translate(250,50)" s:width="30" s:height="25">
    <s:alias val="$or"/>
    <s:alias val="$logic_or"/>
    <s:alias val="$_OR_"/>

    <path d="M0,25 L0,25 L15,25 A15 12.5 0 0 0 15,0 L0,0" class="$cell_id"/>
    <path d="M0,0 A30 25 0 0 1 0,25" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="30" s:y="12.5" s:pid="Y"/>
  </g>
  <g s:type="reduce_nor" transform="translate(250, 100)" s:width="33" s:height="25">
    <s:alias val="$nor"/>
    <s:alias val="$reduce_nor"/>
    <s:alias val="$_NOR_"/>
    <s:alias val="$_ORNOT_"/>

    <path d="M0,25 L0,25 L15,25 A15 12.5 0 0 0 15,0 L0,0" class="$cell_id"/>
    <path d="M0,0 A30 25 0 0 1 0,25" class="$cell_id"/>
    <circle cx="34" cy="12.5" r="3" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="36" s:y="12.5" s:pid="Y"/>
  </g>

  <!--xor -->
  <g s:type="reduce_xor" transform="translate(350, 50)" s:width="33" s:height="25">
    <s:alias val="$xor"/>
    <s:alias val="$reduce_xor"/>
    <s:alias val="$_XOR_"/>

    <path d="M3,0 A30 25 0 0 1 3,25 A30 25 0 0 0 33,12.5 A30 25 0 0 0 3,0" class="$cell_id"/>
    <path d="M0,0 A30 25 0 0 1 0,25" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="33" s:y="12.5" s:pid="Y"/>
  </g>
  <g s:type="reduce_nxor" transform="translate(350, 100)" s:width="33" s:height="25">
    <s:alias val="$xnor"/>
    <s:alias val="$reduce_xnor"/>
    <s:alias val="$_XNOR_"/>

    <path d="M3,0 A30 25 0 0 1 3,25 A30 25 0 0 0 33,12.5 A30 25 0 0 0 3,0" class="$cell_id"/>
    <path d="M0,0 A30 25 0 0 1 0,25" class="$cell_id"/>
    <circle cx="35" cy="12.5" r="3" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="38" s:y="12.5" s:pid="Y"/>
  </g>

  <!--buffer -->
  <g s:type="not" transform="translate(450,100)" s:width="30" s:height="20">
    <s:alias val="$_NOT_"/>
    <s:alias val="$not"/>
    <s:alias val="$logic_not"/>

    <path d="M0,0 L0,20 L20,10 Z" class="$cell_id"/>
    <circle cx="23" cy="10" r="3" class="$cell_id"/>

    <g s:x="0" s:y="10" s:pid="A"/>
    <g s:x="25" s:y="10" s:pid="Y"/>
  </g>

  <g s:type="add" transform="translate(50, 150)" s:width="25" s:height="25">
    <s:alias val="$add"/>

    <circle r="12.5" cx="12.5" cy="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="12.5" y2="12.5" class="$cell_id"/>
    <line x1="12.5" x2="12.5" y1="7.5" y2="17.5" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="25" s:y="12.5" s:pid="Y"/>
  </g>

  <g s:type="sub" transform="translate(150,150)" s:width="25" s:height="25">
    <s:alias val="$sub"/>

    <circle r="12.5" cx="12.5" cy="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="12.5" y2="12.5" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="25" s:y="12.5" s:pid="Y"/>
  </g>
  <g s:type="eq" transform="translate(250,150)" s:width="25" s:height="25">
    <s:alias val="$eq"/>

    <circle r="12.5" cx="12.5" cy="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="10" y2="10" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="15" y2="15" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="25" s:y="12.5" s:pid="Y"/>
  </g>

  <g s:type="dff" transform="translate(350,150)" s:width="30" s:height="40">
    <s:alias val="$dff"/>
    <s:alias val="$_DFF_"/>
    <s:alias val="$_DFF_P_"/>

    <rect width="30" height="40" x="0" y="0" class="$cell_id"/>
    <path d="M0,35 L5,30 L0,25" class="$cell_id"/>

    <g s:x="30" s:y="10" s:pid="Q"/>
    <g s:x="0" s:y="30" s:pid="CLK"/>
    <g s:x="0" s:y="30" s:pid="C"/>
    <g s:x="0" s:y="10" s:pid="D"/>
  </g>

  <g s:type="dffn" transform="translate(450,150)" s:width="30" s:height="40">
    <s:alias val="$_DFF_N_"/>

    <rect width="30" height="40" x="0" y="0" class="$cell_id"/>
    <path d="M0,35 L5,30 L0,25" class="$cell_id"/>
    <circle cx="-3" cy="30" r="3" class="$cell_id"/>

    <g s:x="30" s:y="10" s:pid="Q"/>
    <g s:x="-6" s:y="30" s:pid="CLK"/>
    <g s:x="-6" s:y="30" s:pid="C"/>
    <g s:x="0" s:y="10" s:pid="D"/>
  </g>

  <g s:type="lt" transform="translate(50,200)" s:width="25" s:height="25">
    <s:alias val="$lt"/>

    <circle r="12.5" cx="12.5" cy="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="12.5" y2="7.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="12.5" y2="17.5" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="25" s:y="12.5" s:pid="Y"/>
  </g>

  <g s:type="le" transform="translate(150,200)" s:width="25" s:height="25">
    <s:alias val="$le"/>

    <circle r="12.5" cx="12.5" cy="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="12.5" y2="7.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="12.5" y2="17.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="15" y2="20" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="25" s:y="12.5" s:pid="Y"/>
  </g>

  <g s:type="ge" transform="translate(250,200)" s:width="25" s:height="25">
    <s:alias val="$ge"/>

    <circle r="12.5" cx="12.5" cy="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="7.5" y2="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="17.5" y2="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="20" y2="15" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="25" s:y="12.5" s:pid="Y"/>
  </g>

  <g s:type="gt" transform="translate(350,200)" s:width="25" s:height="25">
    <s:alias val="$gt"/>

    <circle r="12.5" cx="12.5" cy="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="7.5" y2="12.5" class="$cell_id"/>
    <line x1="7.5" x2="17.5" y1="17.5" y2="12.5" class="$cell_id"/>

    <g s:x="3" s:y="5" s:pid="A"/>
    <g s:x="3" s:y="20" s:pid="B"/>
    <g s:x="25" s:y="12.5" s:pid="Y"/>
  </g>

  <g s:type="inputExt" transform="translate(50,250)" s:width="30" s:height="20">
    <text x="15" y="-4" class="nodelabel $cell_id" s:attribute="ref">input</text>
    <s:alias val="$_inputExt_"/>
    <path d="M0,0 L0,20 L15,20 L30,10 L15,0 Z" class="$cell_id"/>
    <g s:x="28" s:y="10" s:pid="Y"/>
  </g>

  <g s:type="constant" transform="translate(150,250)" s:width="30" s:height="20">
    <text x="15" y="-4" class="nodelabel $cell_id" s:attribute="ref">constant</text>

    <s:alias val="$_constant_"/>
    <rect width="30" height="20" class="$cell_id"/>

    <g s:x="30" s:y="10" s:pid="Y"/>
  </g>

  <g s:type="outputExt" transform="translate(250,250)" s:width="30" s:height="20">
    <text x="15" y="-4" class="nodelabel $cell_id" s:attribute="ref">output</text>
    <s:alias val="$_outputExt_"/>
    <path d="M30,0 L30,20 L15,20 L0,10 L15,0 Z" class="$cell_id"/>

    <g s:x="0" s:y="10" s:pid="A"/>
  </g>

  <g s:type="split" transform="translate(350,250)" s:width="5" s:height="40">
    <rect width="5" height="40" class="splitjoinBody" s:generic="body"/>
    <s:alias val="$_split_"/>

    <g s:x="0" s:y="20" s:pid="in"/>
    <g transform="translate(5, 10)" s:x="4" s:y="10" s:pid="out0">
      <text x="5" y="-4">hi:lo</text>
    </g>
    <g transform="translate(5, 30)" s:x="4" s:y="30" s:pid="out1">
      <text x="5" y="-4">hi:lo</text>
    </g>
  </g>

  <g s:type="join" transform="translate(450,250)" s:width="4" s:height="40">
    <rect width="5" height="40" class="splitjoinBody" s:generic="body"/>
    <s:alias val="$_join_"/>
    <g s:x="5" s:y="20"  s:pid="out"/>
    <g transform="translate(0, 10)" s:x="0" s:y="10" s:pid="in0">
      <text x="-3" y="-4" class="inputPortLabel">hi:lo</text>
    </g>
    <g transform="translate(0, 30)" s:x="0" s:y="30" s:pid="in1">
      <text x="-3" y="-4" class="inputPortLabel">hi:lo</text>
    </g>
  </g>

  <g s:type="generic" transform="translate(550,250)" s:width="30" s:height="40">
    <text x="15" y="-4" class="nodelabel $cell_id" s:attribute="ref">generic</text>
    <rect width="30" height="40" s:generic="body" class="$cell_id"/>

    <g transform="translate(30, 10)" s:x="30" s:y="10" s:pid="out0">
      <text x="5" y="-4" style="fill:#000; stroke:none" class="$cell_id">out0</text>
    </g>
    <g transform="translate(30, 30)" s:x="30" s:y="30" s:pid="out1">
      <text x="5" y="-4" style="fill:#000;stroke:none" class="$cell_id">out1</text>
    </g>
    <g transform="translate(0, 10)" s:x="0" s:y="10" s:pid="in0">
      <text x="-3" y="-4" class="inputPortLabel $cell_id">in0</text>
    </g>
    <g transform="translate(0, 30)" s:x="0" s:y="30" s:pid="in1">
      <text x="-3" y="-4" class="inputPortLabel $cell_id">in1</text>
    </g>
  </g>

</svg>
`;
const zip = (a, b) => a.map((k, i) => [k, b[i]]);

export const handler = async (event, context): Promise<APIGatewayProxyResult> => {
    const body = event.body;
    const isBase64Encoded = event.isBase64Encoded;
    const input = isBase64Encoded ? Buffer.from(body, 'base64').toString() : body;
    const circuit = JSON.parse(input);

    // expand modules from circuit into a flat list of modules
    const allModuleSvgs = Object.keys(circuit.modules).map((moduleName) => netlistsvg.render(defaultSkin, {
            creator: circuit.creator,
            modules: {
                [moduleName]: circuit.modules[moduleName]
            }
        })
    );

    return Promise.all(allModuleSvgs).then((svgs) => {
        const allResult = zip(Object.keys(circuit.modules), svgs);
        const reduced = allResult.reduce(
            (reduced, result) => ({...reduced, [result[0]]: result[1]}),
            {}
        );
        return {
            statusCode: 200,
            body: JSON.stringify(reduced),
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
            },
        };
    }).catch((err) => {
        return {
            statusCode: 500,
            body: err,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,GET,PUT,POST,DELETE,PATCH,HEAD",
                "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent",
            },
        }
    });
}
